
import { ethers, utils } from 'ethers'

const mockUSDTAddress = "0xed0eFC33064dB12e4118eB8C9B9F89dd32661D32";
const mockUSDTABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}];
const vammAddress = "0xFe63AdfaB402C1457fB24BAa3a96e7bA5fb36C91";
const vammABI = [{"inputs":[{"internalType":"address","name":"_collateral","type":"address"},{"internalType":"address","name":"_asset","type":"address"},{"internalType":"uint256","name":"_reserveCollateral","type":"uint256"},{"internalType":"uint256","name":"_reserveAsset","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"K","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"asset","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"closeTrade","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"collateral","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"insuranceFunds","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"toLiquidate","type":"address"}],"name":"liquidatePosition","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"liquidationRatio","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"longAmount","type":"uint256"}],"name":"long","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"positions","outputs":[{"internalType":"uint256","name":"size","type":"uint256"},{"internalType":"uint256","name":"liquidationPrice","type":"uint256"},{"internalType":"uint256","name":"costBasis","type":"uint256"},{"internalType":"uint256","name":"entryAmount","type":"uint256"},{"internalType":"enum VAMM.Side","name":"side","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"reserveAsset","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"reserveCollateral","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"shortAmount","type":"uint256"}],"name":"short","outputs":[],"stateMutability":"nonpayable","type":"function"}];


export async function approveUSDT(provider:any){
    const mUSDT = new ethers.Contract(mockUSDTAddress, mockUSDTABI, await provider.getSigner());
    const address = await provider.getSigner().getAddress();
    let approvedAmount = await allowanceUSDT(provider)
    // approvedAmount.wait()
    if (approvedAmount == 0){
        const tx = await mUSDT.approve(vammAddress,ethers.constants.MaxUint256);
        await tx.wait();
        approvedAmount = await allowanceUSDT(provider)
        if(approvedAmount == 0){
            return false;
        }else{
            return true
        }
    }else{
        return true
    }
}

export async function allowanceUSDT(provider:any){
    const mUSDT = new ethers.Contract(mockUSDTAddress, mockUSDTABI, provider);
    const address = await provider.getSigner().getAddress();
    let approvedAmount = await mUSDT.allowance(address,vammAddress)
    return approvedAmount;
}

export async function mintUSDT(provider:any){
    const mUSDT = new ethers.Contract(mockUSDTAddress, mockUSDTABI, await provider.getSigner());
    const tx = await mUSDT.mint(utils.parseEther("10000"));
    await tx.wait();
}

export async function usdtBalance(provider:any){
    const mUSDT = new ethers.Contract(mockUSDTAddress, mockUSDTABI, provider);
    const address = await provider.getSigner().getAddress();
    let balance = await mUSDT.balanceOf(address)
    return balance;
}

export async function getVAMM(provider:any){
    return new ethers.Contract(vammAddress, vammABI, await provider.getSigner());
}