import { Plus, Trash2, GraduationCap } from 'lucide-react';
import { Education } from '../types/curriculum';

interface EducationFormProps {
  education: Education[];
  onChange: (education: Education[]) => void;
}

export default function EducationForm({ education, onChange }: EducationFormProps) {
  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      curso: '',
      instituicao: '',
      cidade: '',
      dataInicio: '',
      dataFim: '',
      cursando: false
    };
    onChange([...education, newEducation]);
  };

  const removeEducation = (id: string) => {
    onChange(education.filter(edu => edu.id !== id));
  };

  const updateEducation = (id: string, field: keyof Education, value: string | boolean) => {
    onChange(
      education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    );
  };

  const inputClasses = "w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-slate-700 placeholder:text-slate-400";
  const labelClasses = "block text-sm font-medium text-slate-700 mb-1.5";

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex justify-end">
        <button
          onClick={addEducation}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm text-sm font-medium"
        >
          <Plus size={16} />
          Adicionar Formação
        </button>
      </div>

      {education.length === 0 && (
        <div className="text-center py-12 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl">
          <div className="bg-slate-100 p-3 rounded-full w-fit mx-auto mb-3">
            <GraduationCap size={24} className="text-slate-400" />
          </div>
          <p className="text-slate-500 font-medium">Nenhuma formação adicionada.</p>
          <p className="text-slate-400 text-sm mt-1">Clique em "Adicionar" para incluir sua formação acadêmica.</p>
        </div>
      )}

      <div className="space-y-4">
        {education.map((edu, index) => (
          <div key={edu.id} className="p-6 border border-slate-200 rounded-xl bg-slate-50/50 hover:border-indigo-200 transition-colors group relative">
            <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => removeEducation(edu.id)}
                className="text-slate-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg"
                title="Remover"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Formação #{index + 1}</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Curso/Grau</label>
                <input
                  type="text"
                  value={edu.curso}
                  onChange={(e) => updateEducation(edu.id, 'curso', e.target.value)}
                  className={inputClasses}
                  placeholder="Ex: Bacharelado em Design"
                />
              </div>

              <div>
                <label className={labelClasses}>Instituição</label>
                <input
                  type="text"
                  value={edu.instituicao}
                  onChange={(e) => updateEducation(edu.id, 'instituicao', e.target.value)}
                  className={inputClasses}
                  placeholder="Nome da Universidade"
                />
              </div>

              <div>
                <label className={labelClasses}>Cidade</label>
                <input
                  type="text"
                  value={edu.cidade}
                  onChange={(e) => updateEducation(edu.id, 'cidade', e.target.value)}
                  className={inputClasses}
                  placeholder="Cidade, Estado"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClasses}>Início</label>
                  <input
                    type="month"
                    value={edu.dataInicio}
                    onChange={(e) => updateEducation(edu.id, 'dataInicio', e.target.value)}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className={labelClasses}>Conclusão</label>
                  <input
                    type="month"
                    value={edu.dataFim}
                    onChange={(e) => updateEducation(edu.id, 'dataFim', e.target.value)}
                    disabled={edu.cursando}
                    className={`${inputClasses} disabled:bg-slate-100 disabled:text-slate-400`}
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center gap-2 cursor-pointer w-fit p-1">
                  <input
                    type="checkbox"
                    checked={edu.cursando}
                    onChange={(e) => updateEducation(edu.id, 'cursando', e.target.checked)}
                    className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                  />
                  <span className="text-sm font-medium text-slate-700">Atualmente cursando</span>
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
