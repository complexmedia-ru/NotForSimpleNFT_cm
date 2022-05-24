import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import truncateEthAddress from 'truncate-eth-address'
import { useWeb3Context } from '../../hooks/useWeb3Context'
import { ArrowRight, LogoutIcon } from '../../icons'
import styles from './AuthButton.module.css'
import { web3ContextInitialValues } from '../../contexts/Web3Context'

const abi = []

export const MetaMaskAuth = () => {
  const {
    updateContextState,
    ethers,
    account: currentAccount,
  } = useWeb3Context()

  const handleEnableEth = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const [account] = await window.ethereum.request({
          method: 'eth_requestAccounts',
        })
        const chainId = await window.ethereum.request({ method: 'eth_chainId' })
        let contractAddress

        // Hardhat Local
        if (chainId === '0x7a69') {
          contractAddress = ''

          // Rinkeby
        } else if (chainId === '0x4') {
          contractAddress = ''

          // Polygon Mainnet
        } else if (chainId === '0x89') {
          contractAddress = ''

          // Polygon Testnet
        } else if (chainId === '0x13881') {
          contractAddress = ''

          // Mainnet
        } else if (chainId === '0x1') {
          contractAddress = ''

          // Ropsten
        } else if (chainId === '0x3') {
          contractAddress = ''
        }

        const signer = provider.getSigner(account)
        const contract = new ethers.Contract(contractAddress, abi, signer)

        updateContextState({
          provider,
          contract,
          // eslint-disable-next-line no-underscore-dangle
          account: contract.signer._address,
        })
      } else if (window.web3) {
        console.log('Update MetaMask')
      } else {
        console.log('Enable MetaMask')
      }
    } catch (e) {
      console.log(e)
    }
  }

  const handleLogout = () => {
    updateContextState(web3ContextInitialValues)
  }

  return !currentAccount ? (
    <button
      type="button"
      className={styles.button__type_login}
      onClick={handleEnableEth}
    >
      <span className="mr-2">Connect wallet</span>
      <ArrowRight />
    </button>
  ) : (
    <div className={styles.button__type_logout}>
      <div className="flex items-center mr-2">
        <Jazzicon diameter={30} seed={jsNumberForAddress(currentAccount)} />
      </div>
      <span className="mr-2">{truncateEthAddress(currentAccount)}</span>
      <button type="button" onClick={handleLogout}>
        <LogoutIcon />
      </button>
    </div>
  )
}
