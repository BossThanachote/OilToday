'use client';

import { useState, useMemo } from 'react';

interface OilPrice {
    id: number;
    brand: string;
    name: string;
    price: number;
    updatedAt: Date;
}

const brandConfig: Record<string, { logo: string, color: string, bgColor: string, textColor: string }> = {
    "PTT": { logo: "http://www.eppo.go.th/epposite/templates/eppo_v15_mixed/images/oil-content/oil_1.png", color: "border-l-blue-600", bgColor: "bg-blue-600", textColor: "text-white" },
    "Bangchak": { logo: "http://www.eppo.go.th/epposite/templates/eppo_v15_mixed/images/oil-content/oil_2-2.png", color: "border-l-green-600", bgColor: "bg-green-600", textColor: "text-white" },
    "Shell": { logo: "http://www.eppo.go.th/epposite/templates/eppo_v15_mixed/images/oil-content/oil_3.png", color: "border-l-yellow-400", bgColor: "bg-yellow-400", textColor: "text-slate-900" },
    "Caltex": { logo: "http://www.eppo.go.th/epposite/templates/eppo_v15_mixed/images/oil-content/oil_5.png", color: "border-l-red-600", bgColor: "bg-red-600", textColor: "text-white" },
    "PT": { logo: "http://www.eppo.go.th/epposite/templates/eppo_v15_mixed/images/oil-content/oil_7.png", color: "border-l-emerald-500", bgColor: "bg-emerald-500", textColor: "text-white" },
    "IRPC": { logo: "http://www.eppo.go.th/epposite/templates/eppo_v15_mixed/images/oil-content/oil_6.png", color: "border-l-blue-800", bgColor: "bg-blue-800", textColor: "text-white" },
    "Susco": { logo: "http://www.eppo.go.th/epposite/templates/eppo_v15_mixed/images/oil-content/oil_8.png", color: "border-l-yellow-200", bgColor: "bg-yellow-200", textColor: "text-slate-900" },
    "Pure": { logo: "http://www.eppo.go.th/epposite/templates/eppo_v15_mixed/images/oil-content/oil_9.png", color: "border-l-indigo-900", bgColor: "bg-indigo-900", textColor: "text-white" },
    "SuscoDealers": { logo: "http://www.eppo.go.th/epposite/templates/eppo_v15_mixed/images/oil-content/oil_10.png", color: "border-l-orange-500", bgColor: "bg-orange-500", textColor: "text-white" },
};

export default function OilExplorer({ initialData }: { initialData: OilPrice[] }) {
    const [viewMode, setViewMode] = useState<'compare' | 'all'>('all');

    const oilTypes = Array.from(new Set(initialData.map(o => o.name))).sort();
    const [selectedType, setSelectedType] = useState(oilTypes[0] || "");

    const lastUpdate = initialData.length > 0
        ? new Date(initialData[0].updatedAt).toLocaleDateString('th-TH', {
            year: 'numeric', month: 'long', day: 'numeric'
        })
        : "-";

    const groupedByBrand = useMemo(() => {
        return initialData.reduce((acc, curr) => {
            if (!acc[curr.brand]) acc[curr.brand] = [];
            acc[curr.brand].push(curr);
            return acc;
        }, {} as Record<string, OilPrice[]>);
    }, [initialData]);

    const compareList = useMemo(() => {
        return initialData
            .filter(o => o.name === selectedType)
            .sort((a, b) => a.price - b.price);
    }, [selectedType, initialData]);

    const minPrice = compareList[0]?.price;
    const cheapestCount = compareList.filter(o => o.price === minPrice).length;
    const showBadge = cheapestCount > 0 && cheapestCount <= (compareList.length / 2);

    return (
        <div className="space-y-10 pb-24 font-sans">

            {/* Hero Date Banner */}
            <div className="bg-slate-900 text-white py-6 px-4 rounded-[2.5rem] shadow-xl text-center mb-12 relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-slate-400 text-sm font-bold uppercase tracking-[0.2em] mb-1">ราคาน้ำมันขายปลีกวันนี้</h2>
                    <p className="text-2xl md:text-3xl font-black text-yellow-400">อัปเดตล่าสุดวันที่ {lastUpdate}</p>
                </div>
                <div className="absolute top-0 right-0 opacity-10 text-8xl -mr-8 -mt-4 rotate-12">⛽</div>
            </div>

            {/* Tab Switcher */}
            <div className="flex justify-center sticky top-6 z-30">
                <div className="bg-white/90 backdrop-blur-xl p-1.5 rounded-[1.5rem] flex gap-1 shadow-2xl border border-white">
                    <button
                        onClick={() => setViewMode('all')}
                        className={`px-8 py-3 rounded-[1.2rem] text-sm font-black transition-all duration-300 ${viewMode === 'all' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        🏪 ดูตามปั๊มทั้งหมด
                    </button>
                    <button
                        onClick={() => setViewMode('compare')}
                        className={`px-8 py-3 rounded-[1.2rem] text-sm font-black transition-all duration-300 ${viewMode === 'compare' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        📊 เปรียบเทียบราคา
                    </button>
                </div>
            </div>

            {viewMode === 'all' ? (
                /* --- โหมดดูทั้งหมด  --- */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Object.entries(groupedByBrand).map(([brand, items]) => {
                        const config = brandConfig[brand] || { logo: "", bgColor: "bg-slate-800", textColor: "text-white" };
                        return (
                            <div key={brand} className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col group">
                                <div className={`${config.bgColor} p-6 flex items-center gap-5 transition-transform group-hover:scale-[1.02] duration-500`}>
                                    <div className="bg-white rounded-2xl p-2 w-14 h-14 flex items-center justify-center shadow-lg">
                                        <img src={config.logo} alt={brand} className="w-10 h-10 object-contain" />
                                    </div>
                                    <h2 className={`${config.textColor} font-black text-2xl tracking-tight`}>{brand}</h2>
                                </div>
                                {/* ✨ เพิ่ม Padding และ Line Break */}
                                <div className="p-8 space-y-6 flex-1">
                                    {items.map((oil) => (
                                        <div key={oil.id} className="flex justify-between items-start gap-4 group/item">
                                            {/* ✨ ป้องกันตัวหนังสือชนราคาด้วย max-w และ leading */}
                                            <span className="text-slate-600 text-[15px] font-bold leading-snug flex-1">
                                                {oil.name}
                                            </span>
                                            <div className="flex items-baseline gap-1.5 shrink-0">
                                                <span className="font-black text-slate-900 text-xl tracking-tighter">{oil.price.toFixed(2)}</span>
                                                <span className="text-[10px] text-slate-400 font-bold">THB</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                /* --- โหมดเปรียบเทียบ --- */
                <div className="flex flex-col lg:flex-row gap-10">
                    <aside className="w-full lg:w-80 shrink-0">
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200 sticky top-28">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.25em] mb-6 px-2">เลือกประเภทน้ำมัน</h3>
                            <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                                {oilTypes.map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setSelectedType(type)}
                                        className={`text-left px-5 py-4 rounded-2xl transition-all duration-300 text-sm font-black ${selectedType === type ? 'bg-blue-600 text-white shadow-blue-200 shadow-xl scale-[1.03]' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </aside>

                    <section className="flex-1 space-y-4">
                        <div className="flex items-center gap-4 px-2 mb-8">
                            <div className="h-10 w-2 bg-blue-600 rounded-full"></div>
                            <h2 className="text-3xl font-black text-slate-800 tracking-tight">{selectedType} <span className="text-slate-300 text-lg font-bold ml-2">ถูกที่สุด</span></h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {compareList.map((oil) => {
                                const isCheapest = oil.price === minPrice;
                                const config = brandConfig[oil.brand] || { logo: "", color: "border-l-slate-400" };
                                return (
                                    <div
                                        key={oil.id}
                                        className={`bg-white rounded-2xl p-5 border border-slate-100 flex flex-col gap-4 transition-all ${isCheapest && showBadge ? 'ring-2 ring-blue-600 ring-offset-2 shadow-md' : 'shadow-sm'
                                            }`}
                                    >
                                        {/* ส่วนบน: โลโก้และชื่อปั๊ม */}
                                        <div className="flex items-center gap-3">
                                            <div className={`w-1.5 h-8 rounded-full ${isCheapest && showBadge ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
                                            <img src={config.logo} className="w-8 h-8 object-contain" alt={oil.brand} />
                                            <span className="font-bold text-slate-700 text-sm">{oil.brand}</span>
                                        </div>

                                        {/* ส่วนล่าง: ราคาและป้าย */}
                                        <div className="flex items-center justify-between mt-auto">
                                            <div>
                                                {isCheapest && showBadge ? (
                                                    <span className="bg-blue-600 text-white text-[9px] font-black px-2 py-1 rounded shadow-sm uppercase tracking-tighter">
                                                        Best Price
                                                    </span>
                                                ) : (
                                                    /* ✨ ถ้าไม่ใช่ราคาที่ถูกที่สุด ให้แสดงคำว่า ราคา */
                                                    <span className="text-slate-400 text-[13px] font-bold">
                                                        ราคา
                                                    </span>
                                                )}
                                            </div>

                                            <div className="text-right flex items-baseline gap-1">
                                                <span className={`text-2xl font-black tracking-tighter ${isCheapest && showBadge ? 'text-blue-600' : 'text-slate-900'}`}>
                                                    {oil.price.toFixed(2)}
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase">บาท</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        
                    </section>
                    
                </div>
            )}
        </div>
    );
}