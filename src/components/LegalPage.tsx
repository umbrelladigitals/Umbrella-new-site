
'use client';

import React, { useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft, Shield, FileText, Lock, Globe, Scale, AlertCircle, Cpu, Eye } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

type LegalDocType = 'privacy' | 'terms';

interface LegalPageProps {
    type: LegalDocType;
    onBack: () => void;
}

// --- Content Data ---

const PRIVACY_DATA_EN = {
    title: "PRIVACY PROTOCOL",
    subtitle: "Data Ingestion & Security Directives",
    version: "v2.4.1",
    updated: "2024.03.15",
    sections: [
        {
            id: "collection",
            title: "01. Data Ingestion",
            icon: <Globe size={24} />,
            content: "We collect information you provide directly to us via our 'Neural Core' (Voice Assistant), contact forms, or 'The Forge' workshop. This includes identity coordinates (Name, Email, Phone) and strategic project parameters. We do not ingest data passively without consent, other than standard telemetry (Cookies) required for system stability."
        },
        {
            id: "usage",
            title: "02. Data Processing",
            icon: <Cpu size={24} />,
            content: "Your data is transmuted into strategic insights. We use it to: (a) Facilitate the 'Digital Alchemy' services you requested; (b) Calibrate our Voice Assistant's responses; (c) Send encrypted transmissions regarding your project status. We do not sell your neural patterns or contact info to third-party data brokers."
        },
        {
            id: "security",
            title: "03. Encryption Protocols",
            icon: <Lock size={24} />,
            content: "We employ enterprise-grade encryption for all data at rest and in transit. However, no transmission over the digital ether is 100% secure. While we strive to protect your personal information, you acknowledge the inherent risks of the digital landscape."
        },
        {
            id: "cookies",
            title: "04. Tracking Beacons",
            icon: <Eye size={24} />,
            content: "We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service."
        }
    ]
};

const PRIVACY_DATA_TR = {
    title: "GİZLİLİK PROTOKOLÜ",
    subtitle: "Veri Alımı & Güvenlik Direktifleri",
    version: "v2.4.1",
    updated: "15.03.2024",
    sections: [
        {
            id: "collection",
            title: "01. Veri Alımı",
            icon: <Globe size={24} />,
            content: "'Nöral Çekirdek' (Sesli Asistan), iletişim formları veya 'Atölye' aracılığıyla bize doğrudan sağladığınız bilgileri topluyoruz. Bu, kimlik koordinatlarını (İsim, E-posta, Telefon) ve stratejik proje parametrelerini içerir. Sistem kararlılığı için gerekli standart telemetri (Çerezler) dışında, rızanız olmadan pasif olarak veri toplamıyoruz."
        },
        {
            id: "usage",
            title: "02. Veri İşleme",
            icon: <Cpu size={24} />,
            content: "Verileriniz stratejik içgörülere dönüştürülür. Bunu şu amaçlarla kullanıyoruz: (a) Talep ettiğiniz 'Dijital Simya' hizmetlerini kolaylaştırmak; (b) Sesli Asistanımızın yanıtlarını kalibre etmek; (c) Proje durumunuzla ilgili şifreli iletimler göndermek. Nöral kalıplarınızı veya iletişim bilgilerinizi üçüncü taraf veri simsarlarına satmıyoruz."
        },
        {
            id: "security",
            title: "03. Şifreleme Protokolleri",
            icon: <Lock size={24} />,
            content: "Duran ve hareket halindeki tüm veriler için kurumsal düzeyde şifreleme kullanıyoruz. Ancak, dijital eter üzerinden hiçbir iletim %100 güvenli değildir. Kişisel bilgilerinizi korumaya çalışsak da, dijital manzaranın doğasında var olan riskleri kabul edersiniz."
        },
        {
            id: "cookies",
            title: "04. İzleme İşaretçileri",
            icon: <Eye size={24} />,
            content: "Hizmetimizdeki etkinliği izlemek ve belirli bilgileri tutmak için çerezler ve benzeri izleme teknolojileri kullanıyoruz. Tarayıcınıza tüm çerezleri reddetmesi veya bir çerez gönderildiğinde bunu belirtmesi talimatını verebilirsiniz. Ancak, çerezleri kabul etmezseniz, Hizmetimizin bazı bölümlerini kullanamayabilirsiniz."
        }
    ]
};

const TERMS_DATA_EN = {
    title: "OPERATIONAL TERMS",
    subtitle: "Service Engagement & Liability",
    version: "v1.0.5",
    updated: "2024.01.10",
    sections: [
        {
            id: "engagement",
            title: "01. Engagement Scope",
            icon: <FileText size={24} />,
            content: "By accessing 'The Forge' or engaging Umbrella Digital, you agree to these terms. Our services ('Alchemy') are provided on a project-basis. Specific deliverables are defined in the separate Statements of Work (SOW) generated after the initial workshop phase."
        },
        {
            id: "ip",
            title: "02. Intellectual Property",
            icon: <Shield size={24} />,
            content: "Upon full payment, all digital artifacts (Code, Designs, Brand Assets) transmuted by Umbrella Digital become the sole property of the Client. Umbrella Digital retains the right to display these artifacts in our 'Selected Work' archives for demonstration purposes, unless a Non-Disclosure Agreement (NDA) is executed."
        },
        {
            id: "payments",
            title: "03. Resource Exchange",
            icon: <Scale size={24} />,
            content: "Payment terms are defined in individual contracts. Generally, a 50% mobilization fee is required to ignite the core team, with the remaining balance due upon successful deployment. Late transfers may result in a suspension of services."
        },
        {
            id: "liability",
            title: "04. Limitation of Liability",
            icon: <AlertCircle size={24} />,
            content: "In no event shall Umbrella Digital, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service."
        }
    ]
};

const TERMS_DATA_TR = {
    title: "OPERASYONEL ŞARTLAR",
    subtitle: "Hizmet Katılımı & Sorumluluk",
    version: "v1.0.5",
    updated: "10.01.2024",
    sections: [
        {
            id: "engagement",
            title: "01. Katılım Kapsamı",
            icon: <FileText size={24} />,
            content: "'Atölye'ye erişerek veya Umbrella Digital ile etkileşime girerek bu şartları kabul edersiniz. Hizmetlerimiz ('Simya') proje bazlı sağlanır. Belirli teslimatlar, ilk atölye aşamasından sonra oluşturulan ayrı İş Bildirimlerinde (SOW) tanımlanır."
        },
        {
            id: "ip",
            title: "02. Fikri Mülkiyet",
            icon: <Shield size={24} />,
            content: "Tam ödeme yapıldığında, Umbrella Digital tarafından dönüştürülen tüm dijital eserler (Kod, Tasarımlar, Marka Varlıkları) Müşterinin tek mülkiyeti haline gelir. Umbrella Digital, bir Gizlilik Anlaşması (NDA) imzalanmadıkça, bu eserleri gösterim amacıyla 'Seçilmiş İşler' arşivlerinde sergileme hakkını saklı tutar."
        },
        {
            id: "payments",
            title: "03. Kaynak Değişimi",
            icon: <Scale size={24} />,
            content: "Ödeme koşulları bireysel sözleşmelerde tanımlanır. Genellikle, çekirdek ekibi ateşlemek için %50 mobilizasyon ücreti gerekir, kalan bakiye başarılı dağıtım üzerine ödenir. Geç transferler hizmetlerin askıya alınmasına neden olabilir."
        },
        {
            id: "liability",
            title: "04. Sorumluluk Sınırlaması",
            icon: <AlertCircle size={24} />,
            content: "Umbrella Digital, yöneticileri, çalışanları, ortakları, acenteleri, tedarikçileri veya iştirakleri, Hizmete erişiminizden veya kullanımınızdan veya erişememenizden veya kullanamamanızdan kaynaklanan kar kaybı, veri, kullanım, iyi niyet veya diğer maddi olmayan kayıplar dahil ancak bunlarla sınırlı olmamak üzere hiçbir dolaylı, arızi, özel, sonuçsal veya cezai zarardan sorumlu tutulamaz."
        }
    ]
};

const LegalPage: React.FC<LegalPageProps> = ({ type, onBack }) => {
    const { language } = useLanguage();
    
    const data = type === 'privacy' 
        ? (language === 'en' ? PRIVACY_DATA_EN : PRIVACY_DATA_TR)
        : (language === 'en' ? TERMS_DATA_EN : TERMS_DATA_TR);

    const uiText = {
        returnToBase: language === 'en' ? "RETURN TO BASE" : "ÜSSE DÖN",
        systemProtocol: language === 'en' ? "System Protocol" : "Sistem Protokolü",
        index: language === 'en' ? "Index" : "İndeks",
        endOfProtocol: language === 'en' ? "End of Protocol. Queries? Transmit to" : "Protokol Sonu. Sorular? İletin:",
        ver: language === 'en' ? "VER:" : "SÜRÜM:",
        updated: language === 'en' ? "UPDATED:" : "GÜNCELLENDİ:"
    };

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [type]);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    return (
        <div className="min-h-screen text-white pt-32 pb-20 relative">
             {/* Back Navigation */}
             <div className="fixed top-24 left-6 md:left-12 z-50">
                <button 
                    onClick={onBack}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-umbrella-main hover:border-umbrella-main transition-all duration-300 group shadow-2xl"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-mono font-medium tracking-wide">{uiText.returnToBase}</span>
                </button>
            </div>

            <div className="max-w-screen-2xl mx-auto px-6 md:px-12 relative z-10">
                
                {/* Cinematic Header */}
                <header className="mb-32">
                     <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="flex items-center gap-4 mb-8"
                    >
                        <div className="h-[1px] w-12 bg-umbrella-main"></div>
                        <span className="font-mono text-umbrella-main tracking-widest uppercase text-sm">{uiText.systemProtocol}</span>
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1, ease: "circOut" }}
                        className="text-6xl md:text-9xl font-display font-black leading-[0.85] mb-8 text-white tracking-tighter mix-blend-difference"
                    >
                        {data.title.split(' ')[0]} <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-700">{data.title.split(' ').slice(1).join(' ')}</span>
                    </motion.h1>
                    
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="flex flex-wrap items-center gap-6 md:gap-12 text-neutral-500 font-mono text-xs md:text-sm uppercase tracking-wider border-t border-white/10 pt-8"
                    >
                        <div className="flex items-center gap-3">
                            <span className="w-2 h-2 bg-umbrella-main rounded-full animate-pulse"></span>
                            <span>{data.subtitle}</span>
                        </div>
                        <div className="hidden md:block w-[1px] h-4 bg-white/20"></div>
                        <div className="flex items-center gap-2">
                             <span className="text-white">{uiText.ver}</span> {data.version}
                        </div>
                        <div className="flex items-center gap-2">
                             <span className="text-white">{uiText.updated}</span> {data.updated}
                        </div>
                    </motion.div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
                    
                    {/* Sticky Sidebar Navigation (HUD Style) */}
                    <div className="lg:col-span-4 hidden lg:block">
                        <div className="sticky top-40">
                            <h3 className="text-xs font-mono font-bold text-neutral-500 mb-8 uppercase tracking-widest flex items-center gap-2">
                                <span className="w-4 h-[1px] bg-neutral-500"></span> {uiText.index}
                            </h3>
                            <div className="space-y-1 relative">
                                <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-white/10"></div>
                                {data.sections.map((section) => (
                                    <button
                                        key={section.id}
                                        onClick={() => scrollToSection(section.id)}
                                        className="group relative w-full text-left py-4 pl-8 border-l-2 border-transparent hover:border-umbrella-main transition-all duration-300"
                                    >
                                        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-umbrella-main scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300"></div>
                                        <div className="flex items-center justify-between">
                                            <span className="font-mono text-xs uppercase text-neutral-500 group-hover:text-white transition-colors">{section.title}</span>
                                            <ArrowLeft size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all rotate-180 text-umbrella-main" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Content Area (Holographic Cards) */}
                    <div className="lg:col-span-8 space-y-12">
                        {data.sections.map((section, index) => (
                            <motion.section 
                                id={section.id} 
                                key={section.id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ delay: index * 0.1, duration: 0.6 }}
                                className="group relative"
                            >
                                {/* Decorative Number Background */}
                                <div className="absolute -top-10 -right-10 text-[8rem] font-display font-bold text-white/[0.03] select-none pointer-events-none group-hover:text-umbrella-main/[0.05] transition-colors duration-500">
                                    0{index + 1}
                                </div>

                                <div className="relative p-8 md:p-12 rounded-3xl bg-neutral-900/40 border border-white/10 backdrop-blur-md overflow-hidden hover:border-umbrella-main/30 transition-all duration-500 shadow-2xl">
                                    {/* Noise & Glow */}
                                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none"></div>
                                    <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-umbrella-main/10 rounded-full blur-[80px] group-hover:bg-umbrella-main/20 transition-colors duration-500"></div>

                                    <div className="relative z-10">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-umbrella-main group-hover:bg-umbrella-main group-hover:text-white transition-all duration-300">
                                                {section.icon}
                                            </div>
                                            <h2 className="text-2xl md:text-3xl font-display font-bold text-white">
                                                {section.title.split('. ')[1]}
                                            </h2>
                                        </div>
                                        
                                        <div className="h-[1px] w-full bg-gradient-to-r from-white/20 to-transparent mb-6"></div>

                                        <p className="text-lg md:text-xl text-neutral-300 leading-relaxed font-light">
                                            {section.content}
                                        </p>
                                    </div>
                                </div>
                            </motion.section>
                        ))}

                        {/* Footer Note */}
                        <div className="pt-12 border-t border-white/10 mt-24 flex items-center gap-4 opacity-60 hover:opacity-100 transition-opacity">
                            <AlertCircle size={20} className="text-umbrella-main" />
                            <p className="text-neutral-500 text-sm font-mono">
                                {uiText.endOfProtocol} <a href="mailto:legal@umbrella.digital" className="text-white hover:text-umbrella-main border-b border-white/20 pb-0.5 hover:border-umbrella-main transition-colors">legal@umbrella.digital</a>.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default LegalPage;
