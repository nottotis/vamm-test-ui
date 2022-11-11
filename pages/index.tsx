import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { ethers, utils } from 'ethers'
import React, { useState, useEffect } from 'react';
import {approveUSDT,allowanceUSDT,getVAMM,usdtBalance,mintUSDT} from "./helpers"
 

export default function Home() {
  let provider: any = null;
  const [address,setAddress] = useState(null);
  const [usdt,setUsdt] = useState("-");
  const [allowance,setAllowance] = useState("-");
  const [vammPrice,setVammPrice] = useState("-")
  const [wethReserve,setWethReserve] = useState("-")
  const [usdtReserve,setUsdtReserve] = useState("-")
  const [position,setPosition] = useState(null)
  const [side,setSide] = useState("-")
  const [size,setSize] = useState("-")
  const [entry,setEntry] = useState("-")
  const [liqPrice,setLiqPrice] = useState("-")
  const [pnl,setPnl] = useState("-")
  const [tradeAmount,setTradeAmount] = useState(0);
  if(typeof window !== "undefined"){
    provider = new ethers.providers.Web3Provider(window.ethereum)
    // console.log(provider);
  } 

  const connectWallet = async () => {
    if(typeof window !== "undefined"){ 
      provider = new ethers.providers.Web3Provider(window.ethereum)
      console.log(provider);
    } 
    if(provider != null) {
      await provider.send("eth_requestAccounts", [])
      setAddress(await provider.getSigner().getAddress())
      setInterval(() => refreshDatas(provider), 1000);
      // console.log(address);
    }
  }

  const approve = async () =>{
    if(address == null){
      alert("Wallet not connected")
      return
    }
    if(provider != null){
      const allowance = await approveUSDT(provider);
      console.log("allow",allowance);
      
    }

  }
  const mint = async () =>{
    if(address == null){
      alert("Wallet not connected")
      return
    }
    if(provider != null){
      const allowance = await mintUSDT(provider);
    }

  }

  const checkAllow = async () =>{
    if(provider != null){
      const allowance = utils.formatEther(await allowanceUSDT(provider));
      setAllowance(allowance)
    }
  }

  const changeTradeAmount = (val:any) =>{
    setTradeAmount(val.target.value)
  }

  const long = async () => {
    if(provider != null){
      const vamm = await getVAMM(provider);
      const tx = await vamm.long(utils.parseEther(tradeAmount.toString()));
      await tx.wait()
    }
  }

  const short = async () => {
    if(provider != null){
      const vamm = await getVAMM(provider);
      const tx = await vamm.short(utils.parseEther(tradeAmount.toString()));
      await tx.wait()
    }
  }
  const closeTrade = async () => {
    if(provider != null){
      const vamm = await getVAMM(provider);
      const tx = await vamm.closeTrade();
      await tx.wait()
    }
  }



  async function refreshDatas(provider:any){
    const vamm = await getVAMM(provider);
    const vammPrice = utils.formatEther(await vamm.getPrice());
    setVammPrice(utils.commify(Number(vammPrice).toFixed(2)));
    const wethReserve = utils.formatEther(await vamm.reserveAsset());
    setWethReserve(utils.commify(Number(wethReserve).toFixed(2)));
    const usdtReserve = utils.formatEther(await vamm.reserveCollateral());
    setUsdtReserve(utils.commify(Number(usdtReserve).toFixed(2)));
    const userUSDT = utils.formatEther(await usdtBalance(provider));
    setUsdt(utils.commify(userUSDT))
    checkAllow()

    const address = await provider.getSigner().getAddress()
    
    if(address != null){
      const position = await vamm.positions(address)
      
      if(position.size > 0){
        setSide(position.side?"SHORT":"LONG")
        setSize(Number(utils.formatEther(position.size)).toFixed(2))
        setEntry(Number(utils.formatEther(position.costBasis)).toFixed(2))
        setLiqPrice(Number(utils.formatEther(position.liquidationPrice)).toFixed(2))
        const diff = (Number(vammPrice) - Number(utils.formatEther(position.costBasis)))
        const symbol = position.side?-1:1;
        const pnl = diff*100/Number(utils.formatEther(position.costBasis)) * symbol
        setPnl(pnl.toFixed(2).toString())
      }else{
        setSide("-")
        setSize("-")
        setEntry("-")
        setLiqPrice("-")
        setPnl("-")
      }
    }
    
  }


  
  return (
    <div className={styles.container}>

      <main className={styles.main}>
        
        {(!address) &&
        <button onClick={connectWallet} >Connect Wallet</button>
        }
        {(address) &&
        <button disabled>{address}</button>
        }

        <h1 className={styles.title}>
          Wrapped Ether (WETH) ${vammPrice}
        </h1>
        

        <div> 
          <p>[For test] Mint $10,000 USDT <button onClick={mint}>Mint</button></p>
          {allowance == "0.0" &&
          <p>[For test] Approve USDT <button onClick={approve} >Approve</button></p>}
          
        </div>
        

        <h2>Stats</h2>
        <b>Virtual WETH reserve</b>
        <div>{wethReserve} WETH</div>
        <b>Virtual USDT reserve</b>
        <div>{usdtReserve} USDT</div>


        <div className={styles.trade}>
          <p>Balance: {usdt} USDT</p>
          
          <p>
            {size =="-" && 
            <div>
              <div>Trade: <input type="number" value={tradeAmount} onChange={changeTradeAmount} /> USDT  </div>
              <button onClick={long} >LONG</button>|<button onClick={short} >SHORT</button>
            </div>
            }
            {size !="-" && 
            <div>
              <div>Cannot hold multiple position. Close before opening new one.</div>
              <div>Trade: <input type="number" disabled value={tradeAmount} onChange={changeTradeAmount} /> USDT  </div>
              <button disabled onClick={long} >LONG</button>|<button disabled onClick={short} >SHORT</button>
            </div>
            }
            
          </p>
        </div>

        <hr />
        {position}
        <h2>Your position</h2>
        <table>
          <tr>
            <th>Side</th>
            <th>Size </th>
            <th>Entry price</th>
            <th>Liquidation price</th>
            <th>PnL</th>
            {size !="-" && 
            <th>Action</th>}
          </tr>
          <tr>
            <td>{side}</td>
            <td>{size}</td>
            <td>${entry}</td>
            <td>${liqPrice}</td>
            <td>{pnl}%</td>
            {size !="-" && 
            <td><button onClick={closeTrade} >Close Trade</button></td>}
          </tr>
        </table>
        
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}

