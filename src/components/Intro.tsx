import { useEffect, useRef, useState } from "react"

type Props = {}

const Intro = (props: Props) => {
    const [selectedTab, setSelectedTab] = useState('Introduction to Xorion Chain')
      const Toc = ['Introduction to Xorion Chain', 'Roadmap Highlights', 'Team & Partners', 'Tokenomics']

            const sectionRefs: Record<string, React.RefObject<HTMLDivElement>> = {
    "Introduction to Xorion Chain": useRef<HTMLDivElement>(null),
    "Roadmap Highlights": useRef<HTMLDivElement>(null),
    "Tokenomics": useRef<HTMLDivElement>(null),
    "Team & Partners": useRef<HTMLDivElement>(null),
  };

  const handleTabClick = (val: string) => {
    const section = sectionRefs[val]?.current;
    if(section){
        const container = section.closest('.scroll-container');
        if(container){
            container.scrollTo({
                top: section.offsetTop,
                behavior: 'smooth'
            })
        }
    }
  };

   useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-id");
            if (id) setSelectedTab(id);
          }
        });
      },
      { rootMargin: "-30% 0px -10% 0px", threshold: 0.3 }
    );

    Object.values(sectionRefs).forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full flex flex-col xl:flex-row px-7 pr-1 mt-5 h-full">
        
        <div className='xl:w-1/4'> 
            <h2 className="font-clash font-semibold text-[36px] xl:text-[30px] 2xl:text-[36px] mt-3
                    leading-[100%] tracking-[0] text-left text-white mb-4"
            >Table of Contents</h2>

                <ul className='flex flex-col lg:flex-row xl:flex-col w-full items-start gap-3 mb-5 xl:mb-0'>
                    {
                        Toc.map((val,idx)=>(
                            <li key={idx} 
                            className={`${selectedTab===val ? 'text-[#CF45C4]' : null} hover:cursor-pointer`}
                            onClick={()=>handleTabClick(val)}>{val}</li>
                        ))
                    }

                </ul>
        </div>

        <div className='w-full lg:w-3/4 h-[496px] mx-auto overflow-y-scroll scrollbar-w-0 scrollbar-thumb-sky-700 flex items-start flex-col
                  justify-around'
                >
            <div 
            ref={sectionRefs["Introduction to Xorion Chain"]} data-id="Introduction to Xorion Chain">
                <img src='/intro.png' alt='Intro to Xorion Chain'
                className=' flex-grow object-cover border-1 border-gray-500 border mt-3'/>

                <div className="opacity-100 text-left w-fit">
                    <h2 className=" opacity-100 font-clash font-bold text-[20px] lg:text-[36px] 
                        leading-[100%] tracking-[0] text-white my-5"
                        >INTRODUCING XORION CHAIN</h2>
                    <p>The Xorion Chain emerges at a pivotal moment in the evolution of the web3, where enterprise and developers seek 
                        blockchain solutions that deliver not only security and decentralization but also scalability, privacy, and seamless interoperability.
                        Designed as an Enterprise-grade blockchain infrastructure, Xorion chain empowers businesses and developers to build decentralized 
                        applications(dApps) that meet the demands of real world adoption. By leveraging a nominated Proof of Stake(NPOS) consensus model, 
                        advanced Zk-Snark privacy layers and a support for multiple virtual machine environments (EVM, WASM, Move), Xorion Chain offers a modular
                        and flexible platform and bridges the gap between enterprise requirements and the decentralized ethos of web3.
                    </p>
                </div>
            </div>

            <div className="opacity-100 text-left w-fit"
            ref={sectionRefs["Roadmap Highlights"]} data-id="Roadmap Highlights">
                <h2 className=" opacity-100 font-clash font-bold text-[20px] lg:text-[36px] 
                    leading-[100%] tracking-[0] text-white my-5"
                    >ROADMAP HIGHLIGHTS</h2>
                <p>The Xorion Chain is engineered to deliver a next generation enterprise grade blockchain ecosystem that redefines 
                    web3 infrastructure through mandatory, scalability, privacy, and interoperability. Our strategic roadmap, spanning 
                    2025 to 2026 and beyond outlines a phased approach to building a robust platform that addresses the core limitations 
                    of legacy blockchains. Each phase is designed to balance technological innovation with community driven growth ensuring 
                    Xorion chain meets the need of enterprises, developers and web3 enthusiast.
                    Starting in Q1-Q2 2025, Xorion Chain will launch it’s testnet, finalizing the Nominated Proof of Stake(NPOS) consensus 
                    model to achieve over 5,000 transactions per second (TPS), alongside Multi VM support for Ethereum Virtual Machine (EVM), 
                    Web Assembly (WASM) and move.
                    In Q3 025, the integration of zk-SHARK privacy layers and forkless agility. The public mainet launch is in.
                    Q4 2025 will introduce developer tools, including SDK’s, CLI interfaces and a block explorer, alongside the Xorion 
                    Enterprise Module (XEM) for private chains.
                    From 2026 onward Xorion Chain will focus on enterprise expansion and cross chain interoperability, leveraging Cosmos IBC, 
                    Ethereum/BSC bridge, and CCIP style protocols to enable seamless multi chain communication. Continuous security audits, grants, 
                    hackathons, and DAO driven governance upgrades will sustain Ecosystem growth and validator engagement.
                </p>
            </div>

            <div className="opacity-100 text-left flex flex-col gap-8 mb-10"
             ref={sectionRefs["Team & Partners"]} data-id="Team & Partners">
                <h2 className=" opacity-100 font-clash font-bold text-[20px] lg:text-[36px] 
                    leading-[100%] tracking-[0] text-white mt-5"
                    >TEAM & PARTNERS</h2>

                <div className="flex flex-col md:flex-row gap-5 ">
                    <img src="\ceo.jpg" className="w-[108px] h-[108px] flex-shrink-0 rounded-full" />
                    <div >
                        <h2 className="font-bold text-[20px] lg:text-[32px] text-[#FFFFFF]">Rajat Sharma - CEO</h2>
                        <p className="pr-16">Over 10 years experience leading research projects and managing successful teams.
                            Skilled in using agile methods to guide plans, encourage teamwork and deliver new 
                            and effective solutions in different areas.
                        </p>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-5 ">
                    <img src="\abena.jpg" className="w-[108px] h-[108px] flex-shrink-0 rounded-full object-cover" />
                    <div >
                        <h2 className="font-bold text-[20px] lg:text-[32px] text-[#FFFFFF]">Benjamin Abena -COO</h2>
                        <p>Extensive Defi business development expertise. Fosters enterprise adoption aligning the
                             quantum and secure platform with market needs.
                        </p>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-5 ">
                    <img src="\clement.jpg" className="w-[108px] h-[108px] flex-shrink-0 rounded-full object-cover" />
                    <div >
                        <h2 className="font-bold text-[20px] lg:text-[32px] text-[#FFFFFF]">Clement Kalu - Full stack Developer</h2>
                        <p>Builds Cli SDKs and a validator dashboard. integrates cross chain (Cosmos IBC, CCIP) and privacy focused dApps.
                        </p>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-5 ">
                    <img src="\Godwin.jpg" className="w-[108px] h-[108px] flex-shrink-0 rounded-full object-cover" />
                    <div >
                        <h2 className="font-bold text-[20px] lg:text-[32px] text-[#FFFFFF]">Godwin Bassey</h2>
                        <p>Ui designer responsible for designing user friendly user interfaces bridging web3 products with its consumers through designs.
                        </p>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-5 ">
                    <img src="\kofi.jpg" className="w-[108px] h-[108px] flex-shrink-0 rounded-full object-cover" />
                    <div >
                        <h2 className="font-bold text-[20px] lg:text-[32px] text-[#FFFFFF]">Kofi Otuo - Blockchain Developer</h2>
                        <p>Expert in smart contract and cryptography. Integrates post quantum signatures, zk-SNAR and multi VM support (EVM, WASM, Move).
                        </p>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-5 ">
                    <img src="\james.jpg" className="w-[108px] h-[108px] flex-shrink-0 rounded-full object-cover" />
                    <div >
                        <h2 className="font-bold text-[20px] lg:text-[32px] text-[#FFFFFF]">James Onyero - Graphics Designer</h2>
                        <p>Creates visuals for socical media and documentation. Enhances brand accessibility for enterprise and developers.
                        </p>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-5 ">
                    <img src="\daniel.jpg" className="w-[108px] h-[108px] flex-shrink-0 rounded-full object-cover" />
                    <div >
                        <h2 className="font-bold text-[20px] lg:text-[32px] text-[#FFFFFF]">Daniel Ekpe - Community Growth Manager</h2>
                        <p>Drives ecosystem growth via 35% XOR tokens grants(350M). Fosters Defi, NFT, and enterprise dApp innovation.
                        </p>
                    </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-5 ">
                    <img src="\elizabeth.jpg" className="w-[108px] h-[108px] flex-shrink-0 rounded-full object-cover" />
                    <div >
                        <h2 className="font-bold text-[20px] lg:text-[32px] text-[#FFFFFF]">Elizabeth Moore  - Moderator</h2>
                        <p>Manages developer and enterprise client feedback. Supports hackathons and validator engagement for adoption.
                        </p>
                    </div>
                </div>
            </div>

            <div className="opacity-100 text-left mb-10"
            ref={sectionRefs["Tokenomics"]} data-id="Tokenomics">
                <h2 className=" opacity-100 font-clash font-bold text-[20px] lg:text-[36px] 
                    leading-[100%] tracking-[0] text-white my-5"
                    >TOKENOMICS</h2>
                <img src="\tokenomics.png" alt="" />
            </div>

        </div>
    </div>
  )
}

export default Intro