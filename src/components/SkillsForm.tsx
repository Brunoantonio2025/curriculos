import { Plus, X, Wrench } from 'lucide-react';
import { Skill } from '../types/curriculum';
import { useState } from 'react';

interface SkillsFormProps {
  skills: Skill[];
  onChange: (skills: Skill[]) => void;
}

export default function SkillsForm({ skills, onChange }: SkillsFormProps) {
  const [inputValue, setInputValue] = useState('');

  const addSkill = () => {
    if (inputValue.trim()) {
      const newSkill: Skill = {
        id: Date.now().toString(),
        nome: inputValue.trim()
      };
      onChange([...skills, newSkill]);
      setInputValue('');
    }
  };

  const removeSkill = (id: string) => {
    onChange(skills.filter(skill => skill.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const inputClasses = "flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-slate-700 placeholder:text-slate-400";

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mb-6">
        <p className="text-sm text-indigo-700">
          Adicione suas competências técnicas e comportamentais (Soft Skills e Hard Skills).
        </p>
      </div>

      <div className="flex gap-3">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          className={inputClasses}
          placeholder="Ex: Gestão de Projetos, Python, Liderança..."
        />
        <button
          onClick={addSkill}
          className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm hover:shadow-indigo-500/20"
        >
          <Plus size={20} />
          Adicionar
        </button>
      </div>

      {skills.length === 0 && (
        <div className="text-center py-12 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl">
          <div className="bg-slate-100 p-3 rounded-full w-fit mx-auto mb-3">
            <Wrench size={24} className="text-slate-400" />
          </div>
          <p className="text-slate-500 font-medium">Nenhuma habilidade adicionada.</p>
          <p className="text-slate-400 text-sm mt-1">Digite acima e pressione Enter para adicionar.</p>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-full shadow-sm hover:border-indigo-300 hover:text-indigo-700 transition-all group"
          >
            <span className="font-medium">{skill.nome}</span>
            <button
              onClick={() => removeSkill(skill.id)}
              className="text-slate-400 hover:text-red-500 transition-colors bg-slate-100 hover:bg-red-50 rounded-full p-0.5"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
