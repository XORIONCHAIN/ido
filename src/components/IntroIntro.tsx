
type Props = {}

const IntroIntro = (props: Props) => {
  return (
    <div>
        <div className='flex-1 mx-auto '>
            <img src='/intro.png' alt='Intro to Xorion Chain'
            className='w-[855px] h-[285px] border-1 border-gray-500 border'/>

            <div className="w-full h-full opacity-100 
                overflow-y-auto"
            >
                <h2 className="w-[908px] h-[44px] opacity-100 font-clash font-bold text-[36px] 
                    leading-[100%] tracking-[0] text-white my-5"
                    >INTRODUCING XORION CHAIN</h2>
                <p>The Xorion Chain emerges at a pivotal moment in the evolution of the web3, where enterprise and developers seek blockchain solutions that deliver not only security and decentralization but also scalability, privacy, and seamless interoperability. Designed as an Enterprise-grade blockchain infrastructure, Xorion chain empowers businesses and developers to build decentralized applications(dApps) that meet the demands of real world adoption. By leveraging a nominated Proof of Stake(NPOS) consensus model, advanced Zk-Snark privacy layers and a support for multiple virtual machine environments (EVM, WASM, Move), Xorion Chain offers a modular and flexible platform and bridges the gap between enterprise requirements and the decentralized ethos of web3</p>
            </div>

        </div>
    </div>
  )
}

export default IntroIntro