import { Plus, Trash2, Briefcase } from 'lucide-react';
import { Experience } from '../types/curriculum';

interface ExperienceFormProps {
  experiences: Experience[];
  onChange: (experiences: Experience[]) => void;
}

export default function ExperienceForm({ experiences, onChange }: ExperienceFormProps) {
  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      cargo: '',
      empresa: '',
      cidade: '',
      dataInicio: '',
      dataFim: '',
      atual: false,
      descricao: ''
    };
    onChange([...experiences, newExperience]);
  };

  const removeExperience = (id: string) => {
    onChange(experiences.filter(exp => exp.id !== id));
  };

  const updateExperience = (id: string, field: keyof Experience, value: string | boolean) => {
    onChange(
      experiences.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    );
  };

  const inputClasses = "w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-slate-700 placeholder:text-slate-400";
  const labelClasses = "block text-sm font-medium text-slate-700 mb-1.5";

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex justify-end">
        <button
          onClick={addExperience}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm text-sm font-medium"
        >
          <Plus size={16} />
          Adicionar Experiência
        </button>
      </div>

      {experiences.length === 0 && (
        <div className="text-center py-12 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl">
          <div className="bg-slate-100 p-3 rounded-full w-fit mx-auto mb-3">
            <Briefcase size={24} className="text-slate-400" />
          </div>
          <p className="text-slate-500 font-medium">Nenhuma experiência adicionada.</p>
          <p className="text-slate-400 text-sm mt-1">Clique em "Adicionar" para incluir seu histórico profissional.</p>
        </div>
      )}

      <div className="space-y-4">
        {experiences.map((exp, index) => (
          <div key={exp.id} className="p-6 border border-slate-200 rounded-xl bg-slate-50/50 hover:border-indigo-200 transition-colors group relative">
            <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => removeExperience(exp.id)}
                className="text-slate-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg"
                title="Remover"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Experiência #{index + 1}</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Cargo</label>
                <input
                  type="text"
                  value={exp.cargo}
                  onChange={(e) => updateExperience(exp.id, 'cargo', e.target.value)}
                  className={inputClasses}
                  placeholder="Ex: Desenvolvedor Senior"
                />
              </div>

              <div>
                <label className={labelClasses}>Empresa</label>
                <input
                  type="text"
                  value={exp.empresa}
                  onChange={(e) => updateExperience(exp.id, 'empresa', e.target.value)}
                  className={inputClasses}
                  placeholder="Nome da empresa"
                />
              </div>

              <div>
                <label className={labelClasses}>Cidade</label>
                <input
                  type="text"
                  value={exp.cidade}
                  onChange={(e) => updateExperience(exp.id, 'cidade', e.target.value)}
                  className={inputClasses}
                  placeholder="Cidade, Estado"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClasses}>Início</label>
                  <input
                    type="month"
                    value={exp.dataInicio}
                    onChange={(e) => updateExperience(exp.id, 'dataInicio', e.target.value)}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className={labelClasses}>Término</label>
                  <input
                    type="month"
                    value={exp.dataFim}
                    onChange={(e) => updateExperience(exp.id, 'dataFim', e.target.value)}
                    disabled={exp.atual}
                    className={`${inputClasses} disabled:bg-slate-100 disabled:text-slate-400`}
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center gap-2 cursor-pointer w-fit p-1">
                  <input
                    type="checkbox"
                    checked={exp.atual}
                    onChange={(e) => updateExperience(exp.id, 'atual', e.target.checked)}
                    className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                  />
                  <span className="text-sm font-medium text-slate-700">Trabalho aqui atualmente</span>
                </label>
              </div>

              <div className="md:col-span-2">
                <label className={labelClasses}>Descrição das Atividades</label>
                <textarea
                  value={exp.descricao}
                  onChange={(e) => updateExperience(exp.id, 'descricao', e.target.value)}
                  rows={4}
                  className={inputClasses}
                  placeholder="• Liderança de equipe técnica&#10;• Desenvolvimento de soluções escaláveis..."
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
