import React, { useEffect, useState } from 'react';
import { connectWallet, getAccount } from '../../utils/wallet';
import './styles.css';
import { Space } from 'antd';

const LoginPage = ({ onConnectWallet }: any) => {
    const [account, setAccount] = useState('');

    useEffect(() => {
        (async () => {
            // Get the active account
            const account = await getAccount();
            setAccount(account);
        })();
    }, []);

    //    // Connect Wallet
    //     const onConnectWallet = async () => {
    //         // get address of the account
    //         await connectWallet();
    //         const account_gotten = await getAccount();
    //         setAccount(account_gotten);
    //         console.log("account: "+ account_gotten);
    //         if (account == "tz1Wtfp36q2WDq2YmHUDkGNaMEdUM6aJHaRn") {
    //           setUserType(User.Admin)
    //           setMenuItems(adminMenuItems)
    //         } else {
    //           setUserType(User.Client)
    //           setMenuItems(clientMenuItems)
    //         }
    //     };

    return (
        <div className="claim-coupon flex-wrap">
            <div style={{ width: '100%' }}>
                <h1>Revolutionize your Coupon Management</h1>
            </div>

            <div style={{ width: '100%' }}>
                <p>Connect your wallet now and unlock the power of effortless coupon tracking.</p>
            </div>

            {/* TODO 4.b - Call connectWallet function onClick  */}
            <button onClick={onConnectWallet} className="connect-wallet-btn">
                {/* TODO 5.a - Show account address if wallet is connected */}
                {account ? account : 'Connect Wallet'}
            </button>
        </div>
    );
};

export default LoginPage;
