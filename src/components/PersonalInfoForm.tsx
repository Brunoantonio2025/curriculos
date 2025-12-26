import { PersonalInfo } from '../types/curriculum';

interface PersonalInfoFormProps {
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
}

export default function PersonalInfoForm({ data, onChange }: PersonalInfoFormProps) {
  const handleChange = (field: keyof PersonalInfo, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const inputClasses = "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-slate-700 placeholder:text-slate-400";
  const labelClasses = "block text-sm font-medium text-slate-700 mb-1.5";

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className={labelClasses}>
            Nome Completo <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.nome}
            onChange={(e) => handleChange('nome', e.target.value)}
            className={inputClasses}
            placeholder="Ex: João da Silva"
          />
        </div>

        <div>
          <label className={labelClasses}>
            E-mail <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={inputClasses}
            placeholder="seu@email.com"
          />
        </div>

        <div>
          <label className={labelClasses}>
            Telefone <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={data.telefone}
            onChange={(e) => handleChange('telefone', e.target.value)}
            className={inputClasses}
            placeholder="(00) 00000-0000"
          />
        </div>

        <div className="md:col-span-2">
          <label className={labelClasses}>
            Cidade e Estado <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.cidade}
            onChange={(e) => handleChange('cidade', e.target.value)}
            className={inputClasses}
            placeholder="Ex: São Paulo, SP"
          />
        </div>

        <div>
          <label className={labelClasses}>
            LinkedIn
          </label>
          <input
            type="url"
            value={data.linkedin || ''}
            onChange={(e) => handleChange('linkedin', e.target.value)}
            className={inputClasses}
            placeholder="linkedin.com/in/seu-perfil"
          />
        </div>

        <div>
          <label className={labelClasses}>
            Portfolio/Website
          </label>
          <input
            type="url"
            value={data.portfolio || ''}
            onChange={(e) => handleChange('portfolio', e.target.value)}
            className={inputClasses}
            placeholder="seu-portfolio.com"
          />
        </div>
      </div>

      <div>
        <label className={labelClasses}>
          Objetivo Profissional
        </label>
        <textarea
          value={data.objetivo || ''}
          onChange={(e) => handleChange('objetivo', e.target.value)}
          rows={4}
          className={inputClasses}
          placeholder="Descreva seu objetivo profissional de forma clara e concisa. Ex: Busco oportunidade na área de desenvolvimento de software..."
        />
        <p className="mt-2 text-xs text-slate-500">
          Dica: Seja breve e direto sobre o cargo ou área que deseja atuar.
        </p>
      </div>
    </div>
  );
}
