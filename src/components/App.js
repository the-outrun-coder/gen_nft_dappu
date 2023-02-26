import { useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { ethers } from 'ethers'

import preview from '../preview.png';

// Components
import Navigation from './Navigation';
import Loading from './Loading';
import MintHud from './MintHud';

// ABIs: Import your contract ABIs here
import NFT_ABI from '../abis/NFT.json'

// Config: Import your network config here
import config from '../config.json';
import Countdown from 'react-countdown';

function App() {
  const [provider, setProvider] = useState(null);
  const [nftContract, setNftContract] = useState(null);

  const [account, setAccount] = useState(null);
  const [revealTime, setRevealTime] = useState(0);
  const [ maxSupply, setMaxSupply] = useState(0);
  const [ totalSupply, setTotalSupply] = useState(0);
  const [ cost, setCost] = useState(0);
  const [ balance, setBalance] = useState(0);

  const [isLoading, setIsLoading] = useState(true);

  const loadBlockchainData = async () => {
    // const network = 
    const { nft } = config[31337];

    // Initiate provider
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);

    // initialize contracts
    const nftContract = new ethers.Contract(nft.address, NFT_ABI, provider);
    setNftContract(nftContract);

    // Fetch accounts
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const account = ethers.utils.getAddress(accounts[0])
    setAccount(account)

    // when minting is allowd - fetch countdown
    const publicMintOpenOn = await nftContract.publicMintOpenOn();
    setRevealTime(publicMintOpenOn.toString() + '000');

    // max supply
    setMaxSupply(await nftContract.maxSupply());
    
    // total supply
    setTotalSupply(await nftContract.totalSupply());
    
    // cost
    setCost(await nftContract.cost());
    
    // balance of current account
    setBalance(await nftContract.balanceOf(account));

    setIsLoading(false)
  }

  useEffect(() => {
    if (isLoading) {
      loadBlockchainData();
    }
  }, [isLoading]);

  return(
    <Container>
      <Navigation account={account} />

      <h1 className='my-4 text-center'>Dapp Punks</h1>

      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Row>
            <Col>
              <img src={preview} alt="Dapp Punks preview" />
            </Col>
            <Col>
              <div className='my-4 text-center'>
                <Countdown date={parseInt(revealTime)} className='h2' />
              </div>
              <MintHud
                maxSupply={maxSupply}
                totalSupply={totalSupply}
                cost={cost}
                balance={balance}
              />
            </Col>
          </Row>
        </>
      )}
    </Container>
  )
}

export default App;
