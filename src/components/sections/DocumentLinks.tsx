import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, Euro, Leaf } from 'lucide-react';

const documents = [
  {
    icon: BookOpen,
    label: 'Vereinssatzung',
    href: '/documents/Vereinssatzung.pdf',
  },
  {
    icon: Euro,
    label: 'Beitragsordnung',
    href: '/documents/Beitragsordnung.pdf',
  },
  {
    icon: Leaf,
    label: 'Mitgliedsantrag',
    href: 'https://easyverein.com/public/CSCN/applicationform/9895',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
  },
};

export function DocumentLinks() {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-muted-foreground font-sans max-w-2xl mx-auto text-lg leading-relaxed">
            Über die Reiter kannst du unsere <span className="text-foreground font-bold">Vereinssatzung</span>, unsere <span className="text-foreground font-bold">Beitragsordnung</span> und
            unseren <span className="text-foreground font-bold">Mitgliedsantrag</span> einsehen.
          </p>
          <p className="text-muted-foreground/80 font-sans mt-6">
            Bei Fragen schreib uns gerne eine Mail{' '}
            <a
              href="mailto:info@csc-nordheide.de"
              className="text-primary hover:text-primary/80 font-bold underline underline-offset-4 transition-all"
            >
              info@csc-nordheide.de
            </a>
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-8"
        >
          {documents.map((doc) => (
            <motion.div key={doc.label} variants={itemVariants}>
              {doc.href.endsWith('.pdf') || doc.href.startsWith('http') ? (
                <a
                  href={doc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-6 group"
                >
                  <div className="w-24 h-24 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 shadow-xl group-hover:shadow-primary/30">
                    <doc.icon className="w-10 h-10 text-primary group-hover:text-primary-foreground transition-colors duration-500" />
                  </div>
                  <span className="text-foreground font-headline font-bold text-lg group-hover:text-primary transition-colors tracking-tight">
                    {doc.label}
                  </span>
                </a>
              ) : (
                <Link
                  to={doc.href}
                  className="flex flex-col items-center gap-6 group"
                >
                  <div className="w-24 h-24 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 shadow-xl group-hover:shadow-primary/30">
                    <doc.icon className="w-10 h-10 text-primary group-hover:text-primary-foreground transition-colors duration-500" />
                  </div>
                  <span className="text-foreground font-headline font-bold text-lg group-hover:text-primary transition-colors tracking-tight">
                    {doc.label}
                  </span>
                </Link>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
