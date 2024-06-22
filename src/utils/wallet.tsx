// Setup a Beacon Wallet instance
import { BeaconWallet } from '@taquito/beacon-wallet';

export const wallet = new BeaconWallet({
    name: 'Tezos Escrow Dapp',
    preferredNetwork: 'ghostnet' as any,
});
// Complete connectWallet function (for ghostnet)
export const connectWallet = async () => {
    await wallet.requestPermissions({ network: { type: 'ghostnet' as any } });
};

// Complete getAccount function
export const getAccount = async () => {
    const connectedWallet = await wallet.client.getActiveAccount(); //account currently connected to the site
    if (connectedWallet) {
        return connectedWallet.address;
    } else {
        return '';
    }
};
