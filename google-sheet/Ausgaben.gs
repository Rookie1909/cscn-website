/**
 * CSCN – Ausgaben-Auswertung (Cannanas API -> Google Sheet)
 *
 * Einrichtung: siehe README.md in diesem Ordner.
 * Zugangsdaten (API-Key, Club-ID) liegen in den Skripteigenschaften, nie in einer Zelle.
 *
 * Datenquelle: Lagerbewegungen vom Typ "dispense" (/inventory/{id}/transactions).
 *  - Menge ist negativ (Abgabe) oder positiv (Storno, Notiz "Storno für Abgabe …").
 *  - Zeitpunkt = occurred_at, falls leer created_at; Tageswechsel nach Europe/Berlin.
 *  - Es werden nur anonyme Summen ausgegeben (keine Mitglieder-IDs).
 */

var CONFIG = {
  API_BASE: 'https://api.cannanas.club/v1/clubs/',
  TIME_ZONE: 'Europe/Berlin',
  // ISO-Wochentag (1 = Mo … 7 = So) -> reguläre Ausgabezeit
  OPENING: {
    3: { label: 'Mi', hours: '18:00 – 20:00 Uhr' },
    5: { label: 'Fr', hours: '15:00 – 17:00 Uhr' },
    6: { label: 'Sa', hours: '16:00 – 18:00 Uhr' }
  },
  TRIGGER_HOUR: 22, // tägliche automatische Aktualisierung (nach Ende der Ausgabe)
  SHEET_OVERVIEW: 'Übersicht',
  SHEET_DAYS: 'Ausgabetage',
  SHEET_STRAINS: 'Sorten',
  COLOR_HEADER: '#2f6b3a',
  COLOR_SUM: '#dcebdc',
  COLOR_OFFDAY: '#fff4d6'
};

var WEEKDAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
var MONTHS = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

// ───────────────────────────── Menü ─────────────────────────────

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Cannanas')
    .addItem('Ausgaben jetzt aktualisieren', 'aktualisieren')
    .addSeparator()
    .addItem('Zugangsdaten eintragen', 'zugangsdatenEintragen')
    .addItem('Tägliche Aktualisierung einschalten', 'triggerEinrichten')
    .addItem('Tägliche Aktualisierung ausschalten', 'triggerEntfernen')
    .addToUi();
}

function zugangsdatenEintragen() {
  var ui = SpreadsheetApp.getUi();
  var props = PropertiesService.getScriptProperties();
  var key = ui.prompt('Cannanas API-Key', 'API-Key einfügen (wird nur in den Skripteigenschaften gespeichert):', ui.ButtonSet.OK_CANCEL);
  if (key.getSelectedButton() !== ui.Button.OK || !key.getResponseText().trim()) return;
  var club = ui.prompt('Club-ID', 'Club-ID einfügen:', ui.ButtonSet.OK_CANCEL);
  if (club.getSelectedButton() !== ui.Button.OK || !club.getResponseText().trim()) return;
  props.setProperty('CANNANAS_API_KEY', key.getResponseText().trim());
  props.setProperty('CANNANAS_CLUB_ID', club.getResponseText().trim());
  ui.alert('Zugangsdaten gespeichert. Jetzt "Ausgaben jetzt aktualisieren" ausführen.');
}

function triggerEinrichten() {
  triggerEntfernen_();
  ScriptApp.newTrigger('aktualisieren').timeBased().everyDays(1).atHour(CONFIG.TRIGGER_HOUR).inTimezone(CONFIG.TIME_ZONE).create();
  SpreadsheetApp.getUi().alert('Das Sheet aktualisiert sich jetzt täglich gegen ' + CONFIG.TRIGGER_HOUR + ' Uhr.');
}

function triggerEntfernen() {
  triggerEntfernen_();
  SpreadsheetApp.getUi().alert('Die tägliche Aktualisierung ist ausgeschaltet.');
}

function triggerEntfernen_() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'aktualisieren') ScriptApp.deleteTrigger(t);
  });
}

// ───────────────────────────── Hauptablauf ─────────────────────────────

function aktualisieren() {
  var props = PropertiesService.getScriptProperties();
  var apiKey = props.getProperty('CANNANAS_API_KEY');
  var clubId = props.getProperty('CANNANAS_CLUB_ID');
  if (!apiKey || !clubId) {
    throw new Error('Zugangsdaten fehlen. Menü "Cannanas" > "Zugangsdaten eintragen".');
  }
  var rows = fetchDispenses_(apiKey, clubId);
  var result = aggregate_(rows);
  writeSheets_(result);
}

// ───────────────────────────── API ─────────────────────────────

function fetchDispenses_(apiKey, clubId) {
  var base = CONFIG.API_BASE + encodeURIComponent(clubId);
  var inv = apiGetAll_([base + '/inventory'], apiKey)[0];
  var items = (inv && inv.items) || [];
  var urls = items.map(function (it) { return base + '/inventory/' + it.id + '/transactions'; });
  var responses = apiGetAll_(urls, apiKey);
  var rows = [];
  responses.forEach(function (res, i) {
    var item = items[i];
    ((res && res.items) || []).forEach(function (t) {
      if (t.type !== 'dispense') return;
      rows.push({
        quantity: Number(t.quantity),
        cartId: t.cart_id || t.id,
        memberId: t.received_by || '',
        when: t.occurred_at || t.created_at,
        itemName: item.name || '',
        itemType: item.type || ''
      });
    });
  });
  return rows;
}

/** Holt mehrere URLs in kleinen Paketen; wiederholt gedrosselte Anfragen (429) mit Wartezeit. */
function apiGetAll_(urls, apiKey) {
  var results = new Array(urls.length);
  var pending = urls.map(function (u, i) { return i; });
  var attempt = 0;
  var CHUNK = 8;
  while (pending.length && attempt < 8) {
    var retry = [];
    for (var s = 0; s < pending.length; s += CHUNK) {
      var idx = pending.slice(s, s + CHUNK);
      var reqs = idx.map(function (i) {
        return { url: urls[i], method: 'get', muteHttpExceptions: true, headers: { Authorization: 'Bearer ' + apiKey } };
      });
      var resp = UrlFetchApp.fetchAll(reqs);
      resp.forEach(function (r, k) {
        var code = r.getResponseCode();
        if (code === 200) results[idx[k]] = JSON.parse(r.getContentText());
        else if (code === 429 || code >= 500) retry.push(idx[k]);
        else throw new Error('Cannanas API ' + code + ' bei ' + urls[idx[k]].replace(/\/clubs\/[^/]+/, '/clubs/…'));
      });
      Utilities.sleep(400);
    }
    pending = retry;
    if (pending.length) { attempt++; Utilities.sleep(3000 * attempt); }
  }
  if (pending.length) throw new Error('Die Cannanas API hat zu oft "zu viele Anfragen" gemeldet. Bitte später erneut versuchen.');
  return results;
}

// ───────────────────────────── Auswertung ─────────────────────────────

function fmt_(iso, pattern) {
  return Utilities.formatDate(new Date(iso), CONFIG.TIME_ZONE, pattern);
}

function strainOf_(name) {
  // "Gorilla Zkittles - Blüten - GZK#202501" -> "Gorilla Zkittles"
  var parts = String(name).split(' - ');
  return parts[0].trim() || String(name);
}

function aggregate_(rows) {
  var days = {};      // yyyy-MM-dd -> Tagesdaten
  var strains = {};   // Sorte -> Daten
  var allMembers = {};
  var allCarts = {};

  rows.forEach(function (r) {
    var day = fmt_(r.when, 'yyyy-MM-dd');
    var d = days[day];
    if (!d) {
      d = days[day] = {
        date: day,
        isoWeekday: Number(fmt_(r.when, 'u')),
        cartNet: {}, cartMember: {}, first: null, last: null, grams: 0, stornoGrams: 0, stornoCarts: {}
      };
    }
    var g = -r.quantity; // Abgabe positiv, Storno negativ
    d.grams += g;
    d.cartNet[r.cartId] = (d.cartNet[r.cartId] || 0) + g;
    if (r.memberId) d.cartMember[r.cartId] = r.memberId;
    if (r.quantity > 0) {
      d.stornoGrams += r.quantity;
      d.stornoCarts[r.cartId] = true;
    } else {
      var time = fmt_(r.when, 'HH:mm');
      if (!d.first || time < d.first) d.first = time;
      if (!d.last || time > d.last) d.last = time;
    }

    var sName = strainOf_(r.itemName);
    var sKey = sName + '|' + r.itemType;
    var s = strains[sKey];
    if (!s) s = strains[sKey] = { name: sName, type: r.itemType, grams: 0, cartNet: {} };
    s.grams += g;
    s.cartNet[r.cartId] = (s.cartNet[r.cartId] || 0) + g;
  });

  var EPS = 0.0001;
  var dayList = Object.keys(days).sort().map(function (k) {
    var d = days[k];
    var carts = Object.keys(d.cartNet).filter(function (c) { return d.cartNet[c] > EPS; });
    var members = {};
    carts.forEach(function (c) {
      if (d.cartMember[c]) { members[d.cartMember[c]] = true; allMembers[d.cartMember[c]] = true; }
      allCarts[c] = true;
    });
    var open = CONFIG.OPENING[d.isoWeekday];
    return {
      date: d.date,
      weekday: WEEKDAYS[d.isoWeekday - 1],
      isoWeekday: d.isoWeekday,
      regular: !!open,
      hours: open ? open.hours : 'außerhalb der Öffnungszeiten',
      first: d.first || '',
      last: d.last || '',
      carts: carts.length,
      members: Object.keys(members).length,
      grams: round1_(d.grams),
      stornoGrams: round1_(d.stornoGrams),
      stornos: Object.keys(d.stornoCarts).length
    };
  }).filter(function (d) { return d.grams > EPS || d.carts > 0; });

  var strainList = Object.keys(strains).map(function (k) {
    var s = strains[k];
    var carts = Object.keys(s.cartNet).filter(function (c) { return s.cartNet[c] > EPS; }).length;
    return { name: s.name, type: s.type, carts: carts, grams: round1_(s.grams) };
  }).filter(function (s) { return s.grams > EPS; })
    .sort(function (a, b) { return b.grams - a.grams; });

  var totalGrams = round1_(dayList.reduce(function (a, d) { return a + d.grams; }, 0));
  var totalCarts = dayList.reduce(function (a, d) { return a + d.carts; }, 0);

  // pro Wochentag
  var byWeekday = [3, 5, 6, 0].map(function (wd) {
    var list = dayList.filter(function (d) { return wd === 0 ? !d.regular : d.isoWeekday === wd; });
    var carts = sum_(list, 'carts');
    var grams = round1_(sum_(list, 'grams'));
    return {
      label: wd === 0 ? 'Sonstige Tage' : CONFIG.OPENING[wd].label + ' (' + CONFIG.OPENING[wd].hours + ')',
      days: list.length, carts: carts, grams: grams,
      avgDay: list.length ? round1_(grams / list.length) : 0,
      avgCart: carts ? round1_(grams / carts) : 0
    };
  });

  // pro Monat
  var monthMap = {};
  dayList.forEach(function (d) {
    var m = d.date.substr(0, 7);
    var o = monthMap[m] || (monthMap[m] = { key: m, days: 0, carts: 0, grams: 0 });
    o.days++; o.carts += d.carts; o.grams += d.grams;
  });
  var byMonth = Object.keys(monthMap).sort().map(function (m) {
    var o = monthMap[m];
    var y = m.substr(0, 4), mi = Number(m.substr(5, 2)) - 1;
    return { label: MONTHS[mi] + ' ' + y, days: o.days, carts: o.carts, grams: round1_(o.grams),
             avgDay: o.days ? round1_(o.grams / o.days) : 0 };
  });

  return {
    days: dayList,
    strains: strainList,
    byWeekday: byWeekday,
    byMonth: byMonth,
    totals: {
      from: dayList.length ? dayList[0].date : '',
      to: dayList.length ? dayList[dayList.length - 1].date : '',
      days: dayList.length,
      carts: totalCarts,
      members: Object.keys(allMembers).length,
      grams: totalGrams,
      avgCart: totalCarts ? round1_(totalGrams / totalCarts) : 0,
      avgDay: dayList.length ? round1_(totalGrams / dayList.length) : 0,
      stornoGrams: round1_(sum_(dayList, 'stornoGrams')),
      offDays: dayList.filter(function (d) { return !d.regular; }).length
    }
  };
}

function round1_(n) { return Math.round(n * 10) / 10; }
function sum_(list, key) { return list.reduce(function (a, x) { return a + x[key]; }, 0); }

// ───────────────────────────── Formeln (Sprache des Sheets) ─────────────────────────────

/**
 * Formeln müssen in der Sprache des Sheets geschrieben werden: Bei deutscher Einstellung trennt ";"
 * die Argumente und "," ist das Dezimalzeichen. Das Script testet einmal, was das Sheet versteht.
 */
var FORMULA_SEP_ = null;

function formulaSep_() {
  if (FORMULA_SEP_) return FORMULA_SEP_;
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var tmp = ss.insertSheet('_formeltest');
  try {
    tmp.getRange('A1').setFormula('=SUM(1,2)');
    SpreadsheetApp.flush();
    FORMULA_SEP_ = tmp.getRange('A1').getValue() === 3 ? ',' : ';';
  } finally {
    ss.deleteSheet(tmp);
  }
  return FORMULA_SEP_;
}

/** Passt die Argumenttrenner aller Formeln (Zellen, die mit "=" beginnen) an das Sheet an. */
function loc_(values) {
  var sep = formulaSep_();
  if (sep === ',') return values;
  return values.map(function (row) {
    return row.map(function (v) {
      return (typeof v === 'string' && v.charAt(0) === '=') ? v.replace(/,/g, sep) : v;
    });
  });
}

// ───────────────────────────── Sheet-Ausgabe ─────────────────────────────

function sheet_(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(name) || ss.insertSheet(name);
  sh.clear();
  sh.clearConditionalFormatRules();
  if (sh.getFilter()) sh.getFilter().remove();
  return sh;
}

function styleHeader_(range) {
  range.setBackground(CONFIG.COLOR_HEADER).setFontColor('#ffffff').setFontWeight('bold')
    .setVerticalAlignment('middle').setWrap(true);
}

function deDate_(iso) { return iso.substr(8, 2) + '.' + iso.substr(5, 2) + '.' + iso.substr(0, 4); }

function writeSheets_(res) {
  writeDays_(res);
  writeStrains_(res);
  writeOverview_(res);
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.setActiveSheet(ss.getSheetByName(CONFIG.SHEET_OVERVIEW));
  ss.moveActiveSheet(1);
}

function writeDays_(res) {
  var sh = sheet_(CONFIG.SHEET_DAYS);
  var header = ['Datum', 'Wochentag', 'Öffnungszeit', 'Erste Ausgabe', 'Letzte Ausgabe', 'Abgaben', 'Mitglieder', 'Gramm (netto)', 'Ø g je Abgabe', 'Stornos', 'Storniert (g)'];
  var n = res.days.length;
  var first = 4, last = first + n - 1;
  sh.getRange(1, 1).setValue('Ausgabetage – neueste zuerst').setFontSize(14).setFontWeight('bold');
  sh.getRange(2, 1).setValue('Die Summenzeile rechnet nur mit den sichtbaren Zeilen (Filter im Tabellenkopf nutzbar). Gelb = Ausgabe außerhalb der regulären Öffnungstage.')
    .setFontColor('#666666');
  sh.getRange(3, 1, 1, header.length).setValues([header]);
  styleHeader_(sh.getRange(3, 1, 1, header.length));

  var days = res.days.slice().reverse();
  if (n) {
    var data = days.map(function (d) {
      return [d.date, d.weekday, d.hours, d.first, d.last, d.carts, d.members, d.grams, d.carts ? round1_(d.grams / d.carts) : 0, d.stornos, d.stornoGrams];
    });
    sh.getRange(first, 1, n, header.length).setValues(data);
    sh.getRange(first, 1, n, 1).setNumberFormat('dd.mm.yyyy');
    // Datum als echtes Datum (für Filter/Sortierung)
    sh.getRange(first, 1, n, 1).setValues(days.map(function (d) { return [new Date(d.date + 'T12:00:00')]; }));
    sh.getRange(first, 8, n, 1).setNumberFormat('#,##0.0');
    sh.getRange(first, 9, n, 1).setNumberFormat('#,##0.0');
    sh.getRange(first, 11, n, 1).setNumberFormat('#,##0.0');
    var offRule = SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=$C' + first + '="außerhalb der Öffnungszeiten"')
      .setBackground(CONFIG.COLOR_OFFDAY).setRanges([sh.getRange(first, 1, n, header.length)]).build();
    sh.setConditionalFormatRules([offRule]);
    sh.getRange(3, 1, n + 1, header.length).createFilter();
  }
  // Summenzeile (ganz unten, farbig, rechnet mit Filter)
  var sumRow = last + 1;
  var rng = function (c) { return c + first + ':' + c + last; };
  sh.getRange(sumRow, 1, 1, header.length).setValues(loc_([[
    'SUMME', '', '', '', '',
    n ? '=SUBTOTAL(109,' + rng('F') + ')' : 0,
    '',
    n ? '=SUBTOTAL(109,' + rng('H') + ')' : 0,
    n ? '=IFERROR(H' + sumRow + '/F' + sumRow + ',0)' : 0,
    n ? '=SUBTOTAL(109,' + rng('J') + ')' : 0,
    n ? '=SUBTOTAL(109,' + rng('K') + ')' : 0
  ]]));
  sh.getRange(sumRow, 1, 1, header.length).setBackground(CONFIG.COLOR_SUM).setFontWeight('bold')
    .setBorder(true, null, null, null, null, null, '#2f6b3a', SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
  sh.getRange(sumRow, 8, 1, 1).setNumberFormat('#,##0.0');
  sh.getRange(sumRow, 9, 1, 1).setNumberFormat('#,##0.0');
  sh.getRange(sumRow, 11, 1, 1).setNumberFormat('#,##0.0');
  sh.getRange(sumRow + 1, 1).setValue('Mitglieder = verschiedene Mitglieder pro Tag (über mehrere Tage nicht addierbar, Gesamtwert siehe Übersicht).')
    .setFontColor('#666666').setFontSize(9);

  sh.setFrozenRows(3);
  sh.setColumnWidths(1, 2, 95);
  sh.setColumnWidth(3, 200);
  sh.setColumnWidths(4, header.length - 3, 105);
  sh.getRange(first, 2, Math.max(n, 1), 1).setHorizontalAlignment('center');
  sh.getRange(first, 4, Math.max(n, 1), 8).setHorizontalAlignment('right');
  sh.setRowHeight(3, 34);
}

function writeStrains_(res) {
  var sh = sheet_(CONFIG.SHEET_STRAINS);
  var header = ['Sorte', 'Produktart', 'Abgaben', 'Gramm (netto)', 'Anteil'];
  var n = res.strains.length;
  sh.getRange(1, 1).setValue('Ausgaben nach Sorte – Gesamtzeitraum').setFontSize(14).setFontWeight('bold');
  sh.getRange(3, 1, 1, header.length).setValues([header]);
  styleHeader_(sh.getRange(3, 1, 1, header.length));
  var first = 4, last = first + n - 1, sumRow = last + 1;
  if (n) {
    var typeLabel = { CANNABIS_FLOWER: 'Blüten', HASH: 'Haschisch', ROSIN: 'Rosin' };
    sh.getRange(first, 1, n, header.length).setValues(res.strains.map(function (s, i) {
      return [s.name, typeLabel[s.type] || s.type, s.carts, s.grams, '=D' + (first + i) + '/D$' + sumRow];
    }));
    sh.getRange(first, 4, n, 1).setNumberFormat('#,##0.0');
    sh.getRange(first, 5, n, 1).setNumberFormat('0.0%');
    sh.getRange(3, 1, n + 1, header.length).createFilter();
    sh.getRange(sumRow, 1, 1, header.length).setValues(loc_([['SUMME', '', '=SUBTOTAL(109,C' + first + ':C' + last + ')', '=SUBTOTAL(109,D' + first + ':D' + last + ')', '']]));
    sh.getRange(sumRow, 1, 1, header.length).setBackground(CONFIG.COLOR_SUM).setFontWeight('bold');
    sh.getRange(sumRow, 4).setNumberFormat('#,##0.0');
    sh.getRange(sumRow + 1, 1).setValue('Abgaben = Anzahl Ausgaben (Warenkörbe), in denen die Sorte enthalten war; Summe kann höher sein als die Gesamtzahl der Abgaben.')
      .setFontColor('#666666').setFontSize(9);
  }
  sh.setFrozenRows(3);
  sh.setColumnWidth(1, 260);
  sh.setColumnWidths(2, 4, 110);
}

function writeOverview_(res) {
  var sh = sheet_(CONFIG.SHEET_OVERVIEW);
  var t = res.totals;
  var r = 1;
  sh.getRange(r, 1).setValue('Cannabis Social Club Nordheide – Ausgaben').setFontSize(16).setFontWeight('bold');
  r++;
  sh.getRange(r, 1).setValue('Stand: ' + Utilities.formatDate(new Date(), CONFIG.TIME_ZONE, 'dd.MM.yyyy HH:mm') + ' Uhr · Quelle: Cannanas API · Zeitraum: ' + (t.from ? deDate_(t.from) + ' – ' + deDate_(t.to) : '–'))
    .setFontColor('#666666');
  r += 2;

  // Kennzahlen
  sh.getRange(r, 1, 1, 2).setValues([['Kennzahl', 'Wert']]); styleHeader_(sh.getRange(r, 1, 1, 2));
  var kpis = [
    ['Ausgabetage', t.days],
    ['Abgaben (Warenkörbe)', t.carts],
    ['Verschiedene Mitglieder', t.members],
    ['Ausgegebene Menge gesamt (g, netto)', t.grams],
    ['Ø Menge je Abgabe (g)', t.avgCart],
    ['Ø Menge je Ausgabetag (g)', t.avgDay],
    ['Storniert (g)', t.stornoGrams],
    ['Tage außerhalb der regulären Öffnungstage', t.offDays]
  ];
  sh.getRange(r + 1, 1, kpis.length, 2).setValues(kpis);
  sh.getRange(r + 1, 2, kpis.length, 1).setHorizontalAlignment('right').setFontWeight('bold').setNumberFormat('#,##0.0');
  sh.getRange(r + 1, 2, 3, 1).setNumberFormat('#,##0');
  sh.getRange(r + 8, 2).setNumberFormat('#,##0');
  r += kpis.length + 2;

  // Wochentage
  sh.getRange(r, 1).setValue('Nach Ausgabetag').setFontWeight('bold').setFontSize(12); r++;
  var h1 = ['Ausgabetag', 'Tage', 'Abgaben', 'Gramm', 'Ø g / Tag', 'Ø g / Abgabe'];
  sh.getRange(r, 1, 1, h1.length).setValues([h1]); styleHeader_(sh.getRange(r, 1, 1, h1.length)); r++;
  var wd = res.byWeekday.map(function (w) { return [w.label, w.days, w.carts, w.grams, w.avgDay, w.avgCart]; });
  var wdFirst = r;
  sh.getRange(r, 1, wd.length, h1.length).setValues(wd); r += wd.length;
  sh.getRange(r, 1, 1, h1.length).setValues(loc_([['SUMME', '=SUM(B' + wdFirst + ':B' + (r - 1) + ')', '=SUM(C' + wdFirst + ':C' + (r - 1) + ')', '=SUM(D' + wdFirst + ':D' + (r - 1) + ')', '=IFERROR(D' + r + '/B' + r + ',0)', '=IFERROR(D' + r + '/C' + r + ',0)']]));
  sh.getRange(r, 1, 1, h1.length).setBackground(CONFIG.COLOR_SUM).setFontWeight('bold');
  sh.getRange(wdFirst, 4, wd.length + 1, 3).setNumberFormat('#,##0.0');
  r += 3;

  // Monate
  sh.getRange(r, 1).setValue('Nach Monat').setFontWeight('bold').setFontSize(12); r++;
  var h2 = ['Monat', 'Tage', 'Abgaben', 'Gramm', 'Ø g / Tag'];
  sh.getRange(r, 1, 1, h2.length).setValues([h2]); styleHeader_(sh.getRange(r, 1, 1, h2.length)); r++;
  var mFirst = r;
  if (res.byMonth.length) {
    sh.getRange(r, 1, res.byMonth.length, h2.length).setValues(res.byMonth.map(function (m) { return [m.label, m.days, m.carts, m.grams, m.avgDay]; }));
    r += res.byMonth.length;
    sh.getRange(r, 1, 1, h2.length).setValues(loc_([['SUMME', '=SUM(B' + mFirst + ':B' + (r - 1) + ')', '=SUM(C' + mFirst + ':C' + (r - 1) + ')', '=SUM(D' + mFirst + ':D' + (r - 1) + ')', '=IFERROR(D' + r + '/B' + r + ',0)']]));
    sh.getRange(r, 1, 1, h2.length).setBackground(CONFIG.COLOR_SUM).setFontWeight('bold');
    sh.getRange(mFirst, 4, res.byMonth.length + 1, 2).setNumberFormat('#,##0.0');
  }
  r += 3;

  // Öffnungszeiten
  sh.getRange(r, 1).setValue('Reguläre Öffnungszeiten').setFontWeight('bold').setFontSize(12); r++;
  [3, 5, 6].forEach(function (k) {
    sh.getRange(r, 1, 1, 2).setValues([[{ 3: 'Mittwoch', 5: 'Freitag', 6: 'Samstag' }[k], CONFIG.OPENING[k].hours]]); r++;
  });

  sh.setColumnWidth(1, 330);
  sh.setColumnWidths(2, 5, 110);
  sh.getRange(1, 2, sh.getMaxRows(), 5).setHorizontalAlignment('right');
  sh.setHiddenGridlines(true);
}
