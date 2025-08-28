import Intro from "@/components/Intro"
import Participate from "@/components/Participate"
import PostIDO from "@/components/PostIDO"
import SaleInfo from "@/components/SaleInfo"
import Security from "@/components/Security"
import Whitelist from "@/components/Whitelist"
import { useMetaMask } from "@/hooks/useMetaMask"
import { useState } from "react"
import { ENDPOINTS } from "@/stores/polkadotStore";
import Countdown from "@/components/Countdown"


type Props = {}

const IDO_CONTRACT = "0xd3f35ee0274369Dc6d99B0eD292f8f74bbAA8827";

const IdoPage = (props: Props) => {

    console.log('end: ', ENDPOINTS)
    const [selectedTab, setSelectedTab] = useState('About the Project');
    const {account, isConnected, error,disconnectWallet, connectWallet, sendToken} = useMetaMask();


  return (
    <div className="flex flex-col bg-[#121212] w-full min-h-[2147px] overflow-x-hiden md:overflow-auto">
      
      <div className="relative w-full h-[982px] ">
    
        <div className="flex justify-between absolute items-center w-full mt-10 px-2">

            <img src='/logo.svg'
            alt='Logo'
            className='w-[84px] h-[52px] 
             z-10 object-cover'
            />
            {/* <button className='w-[176px] h-[54px] top-[58px] right-[80px] absolute
                rotate-0 rounded-[8px] gap-[8px] py-[10px] px-[18px] opacity-100 z-10
                bg-[#F9F9F9] text-[#121212] font-clash font-normal text-[20px] leading-[100%] tracking-[0] text-center'>
            Connect Wallet 

            </button> */}
            <button
            onClick={isConnected ? disconnectWallet  : connectWallet}
            className=" 
                rounded-[8px] py-[10px] px-[18px] z-10
                bg-[#F9F9F9] text-[#121212] font-clash font-normal md:text-[20px] leading-[100%] tracking-[0] text-center"
            >
            {isConnected ? account.slice(0, 6) + "..." + account.slice(-4) : "Connect Wallet"}
            </button>

        </div>


        <img
          src="/first.svg"
          alt="Background"
          className="w-full h-full object-cover"
        />
        <img
          src="/Line.svg"
          alt="Line Overlay"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />

        <div className="absolute w-full h-[118px] top-[150px] sm:top-[200px] md:top-[231px] rotate-0 opacity-100">
            <p className="font-clash font-bold text-[50px] lg:text-[96px] leading-[100%] tracking-[-0.03em] text-center">
                Xorion Chain IDO
            </p>
        </div>
        <div className="absolute w-full top-[280px] md:top-[357px] opacity-100">
            <p className="font-inter font-normal text-[32px] text-[#F9F9F9] leading-[100%] tracking-[0%] text-center"> 
                The next-generation scalable chain on Polkadot Substrate
            </p>
        </div>
       <div className='flex justify-center w-full absolute top-[400px] md:top-[429px]'>
             {/* <button 
                className="w-[176px] h-[54px] opacity-100 
                rounded-[24px] gap-[8px] px-[18px] py-[10px] bg-[#F9F9F9]
                font-clash font-normal text-[20px] leading-[100%] tracking-[0] 
                text-[#121212] text-center shadow-[inset_0px_3px_6px_0px_#24031C40]">
            Connect Wallet
            </button> */}
            <button
            onClick={isConnected ? disconnectWallet : connectWallet}
           className="w-[176px] h-[54px] opacity-100 
                rounded-[24px] gap-[8px] px-[18px] py-[10px] bg-[#F9F9F9]
                font-clash font-normal text-[20px] leading-[100%] tracking-[0] 
                text-[#121212] text-center shadow-[inset_0px_3px_6px_0px_#24031C40]"
            >
            {isConnected ? account.slice(0, 6) + "..." + account.slice(-4) : "Connect Wallet"}
            </button>

       </div>

        <div className='absolute flex  justify-center w-full top-[517px]'>

            <div className="absolute w-4/5 md:2/4 xl:w-2/4 h-[430px] border-[#949494]
                    opacity-100 rounded-[18px] border-[4px] bg-[#24031C] flex flex-col"
            >
            <div className=" flex w-3/4 mt-8  justify-between left-1/2 transform absolute -translate-x-1/2">
                <div className=" opacity-100 flex gap-[16px]">
                <img src='/topImage.png' className="w-[35px] h-[35px] lg:w-[80px] lg:h-[80px] opacity-80" />
                <div className=" opacity-100 flex flex-col">
                    <span className=" font-clash font-normal lg:text-[20px] leading-[100%] tracking-[0] text-white opacity-100"
                    > Xorion</span>
                    <span className="font-clash font-bold text-[20px] lg:text-[40px] leading-[100%] tracking-[0] text-white opacity-100"
                    > XOR</span>
                </div>
                </div>
                <div className="  flex flex-col  first-letter:opacity-100">
                    <span className=" opacity-100 font-clash font-normal text-[20px] leading-[100%] tracking-[0] text-right text-white"
                    > Price</span>
                    <span className=" opacity-100 font-clash font-bold text-[20px] lg:text-[40px] leading-[100%] tracking-[0] text-white"
                    > $0.05</span>
                </div>
            </div>
          
                <div className="w-3/4 h-0 absolute top-[147px] left-1/2 transform -translate-x-1/2 opacity-100 border-t-[2px] border-white/30"></div>

                <p className="w-3/4  left-1/2 transform -translate-x-1/2 absolute top-[156px] right-[46px] opacity-100 
                font-clash font-normal text-[20px] leading-[100%] tracking-[0] text-white text-right"
                >Target</p>

                <div className="w-3/4 left-1/2 transform absolute -translate-x-1/2 ">
                    <div className="w-full h-[40px] absolute top-[194px] opacity-100 rounded-[24px] bg-[#D9D9D966]"
                    ></div>
                    <div className="w-1/4 h-[40px] absolute top-[194px]  opacity-100 rounded-[24px] bg-gradient-to-r from-[#332982] to-[#B5359A]"
                    ></div>
                    <div className="w-1/4 h-[65px] absolute top-[186px] opacity-100"
                    >
                    <div className="w-full rounded-full h-[65px] opacity-100 bg-[#F644D1] blur-[40px] mix-blend-soft-light"
                    ></div>
                    <div className="w-full h-[52px] rounded-full absolute top-[8px] left-[57px] opacity-100 bg-[#F644D1] blur-[40px] bg-blend-color-dodge"
                    ></div>
                </div> 
                </div> 

                <div className="flex justify-between w-3/4 top-[260px] absolute left-1/2 transform -translate-x-1/2
                font-clash font-normal text-[20px] leading-[100%] tracking-[0]">
                    <div>
                    <p>Raised</p>
                    </div> 

                    <div >
                    <p>100k/500k</p>
                    </div>   
                </div>

                <div className="w-3/4 h-0 absolute top-[308px] left-1/2 transform -translate-x-1/2 opacity-100 border-t-[2px] border-white/30"></div>
 

                <div className="flex justify-between items-center w-3/4 top-[330px] absolute left-1/2 transform -translate-x-1/2 ">
                    <div className=" flex flex-col gap-5 leading-[100%] tracking-[0] text-left text-white font-clash font-normal"
                    >
                    <span className="   text-[15px] lg:text-[20px] "
                    > Number of Participants </span>
                    <span className=" text-[25px] lg:text-[40px]"
                    > 350 </span>
                    </div>  
                    <div className="flex flex-col gap-5 font-clash font-normal text-[20px] leading-[100%] tracking-[0] text-right text-white">
                    <span className="text-[20px] "
                    > Time left </span>
                    <span className="text-[40px]"
                    > 
                    <Countdown targetDate="2025-08-27T15:00:00" /> 
                    </span>
                    </div>  
                </div>



            </div>

            </div>

      </div>

      {/* SECOND HALF  */}

      <div className='relative pt-10'>
        {/* Ellipse  */}
            <div className="w-1/3 lg:w-[500px] h-[500px] absolute left-[-139px] opacity-100 bg-[#9A4DFF4D] blur-[125px]"
            >
            </div>
            <div className="w-1/3 lg:w-[340px] h-[340px] absolute left-[792px] top-[518px] opacity-100 bg-[#9A4DFF]/30 blur-[125px]"
            ></div>
             <div className="w-1/3 lg:w-[500px] h-[500px] absolute right-[-150px] bg-[#9A4DFF]/30 blur-[125px]"></div>

            {/* TABS & CONTENTS */}
           <div className='flex relative justify-center mb-48'>
                 <div className="w-[95%] md:w-4/5  opacity-100 relative
                        rounded-b-[18px]  mx-auto bg-black">
                    {/* TABS  */}
                   <div className="w-full text-[15px] opacity-100 grid grid-cols-3 lg:grid-cols-6 gap-3 md:gap-[18px] text-black">
                        <button className={`h-[60px] px-1 rounded-tl-[18px] rounded-tr-[18px] hover:bg-[#454545] hover:text-white ${selectedTab==='Sale Info' ? 'bg-[#454545]' : 'bg-[#D9D9D9]'}`}
                            onClick={()=>setSelectedTab('Sale Info')}>Sale Info</button>
                        
                        <button className={`h-[60px] px-1 rounded-tl-[18px] rounded-tr-[18px] hover:bg-[#454545] hover:text-white ${selectedTab==='About the Project' ? 'bg-[#454545] text-white' : 'bg-[#D9D9D9]'}`}
                            onClick={()=>setSelectedTab('About the Project')}>About the Project</button>
                        
                        <button className={`h-[60px] px-1 pr-1 rounded-tl-[18px] rounded-tr-[18px] hover:bg-[#454545] hover:text-white ${selectedTab==='Participate' ? 'bg-[#454545] text-white' : 'bg-[#D9D9D9]'}`}
                            onClick={()=>setSelectedTab('Participate')}>Participate</button>
                        
                        <button className={`h-[60px] px-1 rounded-tl-[18px] rounded-tr-[18px] hover:bg-[#454545] hover:text-white ${selectedTab==='Whitelist' ? 'bg-[#454545] text-white' : 'bg-[#D9D9D9]'}`}
                            onClick={()=>setSelectedTab('Whitelist')}>Whitelist</button>
                        
                        <button className={`h-[60px] px-1 rounded-tl-[18px] rounded-tr-[18px] hover:bg-[#454545] hover:text-white ${selectedTab==='Security' ? 'bg-[#454545] text-white' : 'bg-[#D9D9D9]'}`}
                            onClick={()=>setSelectedTab('Security')}>Security</button>
                        
                        <button className={`h-[60px] px-1 rounded-tl-[18px] rounded-tr-[18px] hover:bg-[#454545] hover:text-white ${selectedTab==='Post IDO' ? 'bg-[#454545] text-white' : 'bg-[#D9D9D9]'}`}
                            onClick={()=>setSelectedTab('Post IDO')}>Post IDO</button>
                        </div>
                    {/* CONTNTS  */}
                    <div className='pt-7 w-full gap-10  h-[496px] overflow-hidden bg-[#454545] rounded-b-lg'>
                       {selectedTab === 'Sale Info' && <SaleInfo />}
                       {selectedTab === 'About the Project' && <Intro />}
                       {selectedTab === 'Participate' && <Participate 
                                                            isConnected={isConnected}
                                                            account={account}
                                                            connectWallet={connectWallet}
                                                            sendToken={sendToken}
                                                            idoContract={IDO_CONTRACT} />}
                       {selectedTab === 'Whitelist' && <Whitelist 
                                                        isConnected={isConnected}
                                                            account={account}
                                                            connectWallet={connectWallet}
                                                            disconnectWallet={disconnectWallet}
                                                            sendToken={sendToken}
                                                            idoContract={IDO_CONTRACT}/>}
                       {selectedTab === 'Security' && <Security />}
                       {selectedTab === 'Post IDO' && <PostIDO />}
                    </div>

                </div>
           </div>


           <div className="flex justify-center mt-36 mb-36">
                <div
                    className="w-3/4 h-[255px] rounded-[18px] 
                        border-[4px] border-[#949494] bg-[#24031C]"
                    >
                        <div className="lg:w-[377px] h-full flex flex-col mx-auto items-center justify-center gap-[16px]">
                            <span className="font-clash font-bold text-[30px] md:text-[36px] leading-[100%] tracking-[0] text-center">
                                Time till TGE
                            </span>
                            <span className="font-clash font-normal text-[25px] md:text-[128px] leading-[100%] tracking-[0]">
                               <Countdown targetDate="2025-08-27T15:00:00" />
                            </span>
                        </div>

                </div>
            </div>
      </div>


        {/* FOOTER  */}

        <div className="w-full mt-28 min-h-[420px] bg-[url('/idofooter.png')] bg-cover bg-center mx-auto">
    <div className="mt-16 w-full max-w-6xl mx-auto px-4">

        <div className="flex flex-wrap md:justify-around lg:justify-between text-[20px] leading-[100%] tracking-[0]">
            
            <div className="w-full md:w-1/2 lg:w-1/4 space-y-3 mb-8">
                <h3 className="font-clash font-bold text-[40px] leading-[100%] tracking-[0]">Social</h3>
                <ol>Telegram Community</ol>
                <ol>Discord</ol>
                <ol>Twitter</ol>
            </div>
            <div className="w-full md:w-1/2 lg:w-1/4 space-y-3 mb-8">
                <h3 className="font-clash font-bold text-[40px] leading-[100%] tracking-[0]">Token</h3>
                <ol>Coin MarketCap</ol>
                <ol>Dex Screener</ol>
                <ol>CoinGecko</ol>
                <ol>Defi Llama</ol>
                <ol>CryptoRank</ol>
            </div>
            <div className="w-full md:w-1/2 lg:w-1/4 space-y-3 mb-8">
                <h3 className="font-clash font-bold text-[40px] leading-[100%] tracking-[0]">Help</h3>
                <ol>Status</ol>
                <ol>Terms of service</ol>
                <ol>Privacy</ol>
                <ol>FAQ</ol>
                <ol>Whitepaper</ol>
            </div>
            <div className="w-full md:w-1/2 lg:w-1/4 space-y-3 mb-8">
                <h3 className="font-clash font-bold text-[40px] leading-[100%] tracking-[0]">Exchanges</h3>
                <ol>Bitget</ol>
                <ol>Meta Mask</ol>
                <ol>Bybit</ol>
            </div>
        </div>
    </div>
</div>

    </div>
  )
}

export default IdoPage


