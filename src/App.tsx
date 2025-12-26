import { useState, useRef } from 'react';
import {
  FileText,
  Download,
  Eye,
  Edit3,
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  ChevronRight
} from 'lucide-react';
import PersonalInfoForm from './components/PersonalInfoForm';
import ExperienceForm from './components/ExperienceForm';
import EducationForm from './components/EducationForm';
import SkillsForm from './components/SkillsForm';
import CurriculumPreview from './components/CurriculumPreview';
import PaymentModal from './components/PaymentModal';
import { Curriculum } from './types/curriculum';
import { downloadPDF } from './utils/pdfExport';

function App() {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [activeSection, setActiveSection] = useState<'personal' | 'experience' | 'education' | 'skills'>('personal');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  const componentRef = useRef<HTMLDivElement>(null);

  const [curriculum, setCurriculum] = useState<Curriculum>({
    personalInfo: {
      nome: '',
      email: '',
      telefone: '',
      cidade: '',
      endereco: '',
      linkedin: '',
      portfolio: '',
      objetivo: ''
    },
    experiences: [],
    education: [],
    skills: []
  });

  const handleExport = () => {
    const fileName = curriculum.personalInfo.nome
      ? `Curriculo_${curriculum.personalInfo.nome.replace(/\s+/g, '_')}.pdf`
      : 'Curriculo.pdf';

    downloadPDF('curriculum-export', fileName);
  };

  const handleExportClick = () => {
    if (isPaid) {
      handleExport();
    } else {
      setIsPaymentModalOpen(true);
    }
  };

  const handlePaymentSuccess = () => {
    setIsPaid(true);
    setIsPaymentModalOpen(false);
    // Inicia o download automaticamente após confirmar
    // Pequeno delay para garantir que o modal fechou e o download seja disparado corretamente no navegador
    setTimeout(() => {
      handleExport();
    }, 500);
  };

  const steps = [
    { id: 'personal', label: 'Dados Pessoais', shortLabel: 'Pessoal', icon: User, component: PersonalInfoForm, dataKey: 'personalInfo' },
    { id: 'experience', label: 'Experiência', shortLabel: 'Exp.', icon: Briefcase, component: ExperienceForm, dataKey: 'experiences' },
    { id: 'education', label: 'Educação', shortLabel: 'Edu.', icon: GraduationCap, component: EducationForm, dataKey: 'education' },
    { id: 'skills', label: 'Habilidades', shortLabel: 'Skills', icon: Wrench, component: SkillsForm, dataKey: 'skills' },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Header Responsivo */}
      <header className="bg-slate-900 text-white shadow-lg z-50 sticky top-0">
        <div className="container mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500 p-1.5 lg:p-2 rounded-lg shrink-0">
              <FileText size={20} className="text-white" />
            </div>
            <span className="font-bold text-base lg:text-lg tracking-tight truncate hidden xs:block">CV Builder Pro</span>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            <div className="bg-slate-800 p-1 rounded-lg flex items-center shrink-0">
              <button
                onClick={() => setActiveTab('edit')}
                className={`px-3 py-1.5 rounded-md text-xs lg:text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'edit'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
                  }`}
              >
                <Edit3 size={14} />
                <span className="hidden sm:inline">Editor</span>
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1.5 rounded-md text-xs lg:text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'preview'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
                  }`}
              >
                <Eye size={14} />
                <span className="hidden sm:inline">Visualizar</span>
              </button>
            </div>

            <button
              onClick={handleExportClick}
              className="flex items-center gap-2 px-3 lg:px-5 py-2 bg-emerald-600 text-white rounded-lg text-xs lg:text-sm font-medium hover:bg-emerald-500 transition-colors shadow-lg hover:shadow-emerald-500/20 whitespace-nowrap"
            >
              <Download size={16} />
              <span className="hidden sm:inline">Exportar PDF</span>
              <span className="sm:hidden">PDF</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 lg:px-6 py-6 lg:py-8 overflow-hidden">
        {activeTab === 'edit' ? (
          <div className="flex flex-col lg:flex-row gap-6 items-start max-w-6xl mx-auto h-full">
            {/* Nav Mobile (Horizontal Scroll) / Desktop (Sidebar) */}
            <nav className="w-full lg:w-64 flex-shrink-0 bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto lg:overflow-visible sticky top-[72px] z-40 lg:top-24 scrollbar-hide">
              <div className="hidden lg:block p-4 bg-slate-50 border-b border-slate-100">
                <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Seções</h2>
              </div>
              <ul className="flex lg:flex-col min-w-full p-2 lg:p-0">
                {steps.map((step) => {
                  const Icon = step.icon;
                  const isActive = activeSection === step.id;
                  return (
                    <li key={step.id} className="flex-1 lg:flex-none min-w-[100px]">
                      <button
                        onClick={() => setActiveSection(step.id as any)}
                        className={`w-full lg:text-left px-3 lg:px-4 py-2 lg:py-3 flex flex-col lg:flex-row items-center justify-center lg:justify-start gap-1 lg:gap-3 transition-colors border-b-2 lg:border-b-0 lg:border-l-4 rounded-lg lg:rounded-none ${isActive
                          ? 'border-indigo-600 text-indigo-700 bg-indigo-50 lg:bg-indigo-50'
                          : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                      >
                        <Icon size={18} className={isActive ? 'text-indigo-600' : 'text-slate-400'} />
                        <span className="font-medium text-xs lg:text-sm whitespace-nowrap">
                          <span className="lg:hidden">{step.shortLabel}</span>
                          <span className="hidden lg:inline">{step.label}</span>
                        </span>
                        {isActive && <ChevronRight size={14} className="ml-auto opacity-50 hidden lg:block" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Área de Edição */}
            <div className="flex-1 min-w-0 w-full">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 lg:p-8 min-h-[500px] animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-6 pb-6 border-b border-slate-100">
                  <h2 className="text-xl lg:text-2xl font-bold text-slate-800 flex items-center gap-3">
                    {steps.find(s => s.id === activeSection)?.label}
                  </h2>
                  <p className="text-sm lg:text-base text-slate-500 mt-1">
                    Preencha as informações para compor seu currículo.
                  </p>
                </div>

                <div className="space-y-6">
                  {activeSection === 'personal' && (
                    <PersonalInfoForm
                      data={curriculum.personalInfo}
                      onChange={(personalInfo) =>
                        setCurriculum({ ...curriculum, personalInfo })
                      }
                    />
                  )}

                  {activeSection === 'experience' && (
                    <ExperienceForm
                      experiences={curriculum.experiences}
                      onChange={(experiences) =>
                        setCurriculum({ ...curriculum, experiences })
                      }
                    />
                  )}

                  {activeSection === 'education' && (
                    <EducationForm
                      education={curriculum.education}
                      onChange={(education) =>
                        setCurriculum({ ...curriculum, education })
                      }
                    />
                  )}

                  {activeSection === 'skills' && (
                    <SkillsForm
                      skills={curriculum.skills}
                      onChange={(skills) =>
                        setCurriculum({ ...curriculum, skills })
                      }
                    />
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col xs:flex-row justify-between gap-3">
                  <button
                    onClick={() => {
                      const idx = steps.findIndex(s => s.id === activeSection);
                      if (idx > 0) setActiveSection(steps[idx - 1].id as any);
                    }}
                    disabled={activeSection === steps[0].id}
                    className="px-4 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg hover:text-indigo-600 disabled:opacity-50 disabled:bg-slate-50 disabled:text-slate-400 transition-colors w-full xs:w-auto"
                  >
                    ← Anterior
                  </button>
                  <button
                    onClick={() => {
                      const idx = steps.findIndex(s => s.id === activeSection);
                      if (idx < steps.length - 1) setActiveSection(steps[idx + 1].id as any);
                      else setActiveTab('preview');
                    }}
                    className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-md hover:shadow-indigo-500/20 w-full xs:w-auto"
                  >
                    {activeSection === steps[steps.length - 1].id ? 'Finalizar' : 'Próximo →'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-300 px-0 lg:px-4">
            <div className="bg-white shadow-2xl rounded-sm overflow-hidden min-h-[500px] lg:min-h-[1000px] overflow-x-auto">
              <div className="min-w-[900px] lg:min-w-0 scale-[0.35] sm:scale-[0.5] md:scale-[0.7] lg:scale-100 origin-top-left">
                <CurriculumPreview data={curriculum} />
              </div>
            </div>
            <div className="text-center mt-4 lg:mt-8 pb-8">
              <button
                onClick={() => setActiveTab('edit')}
                className="px-6 py-2 bg-slate-800 text-white rounded-full text-sm font-medium hover:bg-slate-700 transition-colors shadow-lg flex items-center justify-center gap-2 mx-auto"
              >
                <Edit3 size={14} /> Voltar para edição
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Hidden layout for printing with explicit position fixed to ensure it is rendered and capturable */}
      <div style={{ position: 'fixed', left: '-10000px', top: 0 }}>
        <CurriculumPreview id="curriculum-export" ref={componentRef} data={curriculum} />
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}

export default App;
