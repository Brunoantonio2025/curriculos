import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';
import { Curriculum } from '../types/curriculum';
import { forwardRef } from 'react';

interface CurriculumPreviewProps {
  data: Curriculum;
}

const CurriculumPreview = forwardRef<HTMLDivElement, CurriculumPreviewProps>(({ data }, ref) => {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');
    return `${month}/${year}`;
  };

  return (
    <div className="w-full bg-slate-200/50 p-4 sm:p-8 flex justify-center print:p-0 print:bg-white">
      <div
        ref={ref}
        id="curriculum-preview"
        className="w-full max-w-[21cm] bg-white shadow-2xl min-h-[29.7cm] p-[2cm] mx-auto text-slate-800 print:shadow-none print:m-0 print:w-full print:max-w-none print:min-h-0"
      >
        <header className="border-b-2 border-slate-900 pb-8 mb-8">
          <h1 className="text-4xl md:text-5xl font-serif-display font-bold text-slate-900 mb-4 tracking-tight">
            {data.personalInfo.nome || 'Seu Nome'}
          </h1>

          <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-slate-600 font-medium">
            {data.personalInfo.email && (
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-slate-400" />
                <span>{data.personalInfo.email}</span>
              </div>
            )}
            {data.personalInfo.telefone && (
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-slate-400" />
                <span>{data.personalInfo.telefone}</span>
              </div>
            )}
            {data.personalInfo.endereco && (
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-slate-400" />
                <span>{data.personalInfo.endereco}</span>
              </div>
            )}
            {data.personalInfo.cidade && (
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-slate-400" />
                <span>{data.personalInfo.cidade}</span>
              </div>
            )}
            {data.personalInfo.linkedin && (
              <div className="flex items-center gap-2">
                <Linkedin size={14} className="text-slate-400" />
                <span className="break-all">{data.personalInfo.linkedin}</span>
              </div>
            )}
            {data.personalInfo.portfolio && (
              <div className="flex items-center gap-2">
                <Globe size={14} className="text-slate-400" />
                <span className="break-all">{data.personalInfo.portfolio}</span>
              </div>
            )}
          </div>
        </header>

        <div className="space-y-8">
          {data.personalInfo.objetivo && (
            <section>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">
                Objetivo
              </h2>
              <p className="text-slate-700 leading-relaxed text-justify">
                {data.personalInfo.objetivo}
              </p>
            </section>
          )}

          {data.experiences.length > 0 && (
            <section>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 border-b border-slate-100 pb-2">
                Experiência Profissional
              </h2>
              <div className="space-y-6">
                {data.experiences.map((exp) => (
                  <div key={exp.id} className="relative pl-4 border-l-2 border-slate-100">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-serif-display font-bold text-lg text-slate-900">
                        {exp.cargo}
                      </h3>
                      <span className="text-xs font-medium text-slate-500 whitespace-nowrap bg-slate-50 px-2 py-1 rounded">
                        {formatDate(exp.dataInicio)} — {exp.atual ? 'Atual' : formatDate(exp.dataFim)}
                      </span>
                    </div>

                    <div className="text-sm font-semibold text-indigo-600 mb-2">
                      {exp.empresa} <span className="text-slate-400 font-normal mx-1">•</span> {exp.cidade}
                    </div>

                    {exp.descricao && (
                      <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line text-justify">
                        {exp.descricao}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.education.length > 0 && (
            <section>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 border-b border-slate-100 pb-2">
                Formação Acadêmica
              </h2>
              <div className="space-y-4">
                {data.education.map((edu) => (
                  <div key={edu.id} className="flex justify-between items-start group">
                    <div>
                      <h3 className="font-serif-display font-bold text-slate-900">
                        {edu.curso}
                      </h3>
                      <div className="text-sm text-indigo-600 mt-0.5">
                        {edu.instituicao}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {edu.cidade}
                      </div>
                    </div>
                    <div className="text-xs font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded">
                      {formatDate(edu.dataInicio)} — {edu.cursando ? 'Atualmente' : formatDate(edu.dataFim)}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.skills.length > 0 && (
            <section>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 border-b border-slate-100 pb-2">
                Habilidades
              </h2>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="px-3 py-1.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-md border border-slate-200"
                  >
                    {skill.nome}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
});

export default CurriculumPreview;
