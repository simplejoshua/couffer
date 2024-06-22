import { useState, useEffect } from 'react';
import './styles.css';
import CouponCard from '../ClaimCoupon/CouponCard';
import { access_contract, contract_count } from '../../utils/operation';
import { fetchStorage } from '../../utils/tzkt';
import dayjs from 'dayjs';

interface NFTContractType {
    ledger: number;
    merchant: string;
    metadata: number;
    claimants: {};
    coupon_id: string;
    operators: number;
    coupon_code: string;
    description: string;
    total_supply: string;
    administrator: string;
    last_token_id: string;
    token_metadata: number;
    expiration_date: number;
    image_url: string;
}

const ViewCoupons = () => {
    const [NFTContracts, setNFTContracts] = useState<NFTContractType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const count = await contract_count();
                const storage = await fetchStorage();
                const contracts: NFTContractType[] = [];

                for (let i = 0; i < Number(count); i++) {
                    const contract = await access_contract(i);
                    contracts.push(contract as NFTContractType);
                }

                setNFTContracts(contracts);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    const bytes2char = (bytes: Uint8Array) => {
        const decoder = new TextDecoder();
        return decoder.decode(bytes);
    };

    const hexToUint8Array = (hex: string): Uint8Array => {
        const bytes = new Uint8Array(hex.length / 2);
        for (let i = 0; i < hex.length; i += 2) {
            bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
        }
        return bytes;
    };

    return (
        <div className="view-coupons flex-wrap">
            {NFTContracts.length === 0 ? (
                <div>No coupons available</div>
            ) : (
                NFTContracts.map((contract, index) => (
                    <CouponCard
                        key={index}
                        index={index}
                        image_src={bytes2char(hexToUint8Array(contract.image_url))}
                        coupon_code={bytes2char(hexToUint8Array(contract.coupon_code))}
                        description={bytes2char(hexToUint8Array(contract.description))}
                        expiration_date={dayjs.unix(contract.expiration_date).format("MMM DD, YYYY")}
                        merchant={bytes2char(hexToUint8Array(contract.merchant))}
                        disable={true}
                    />
                ))
            )}
        </div>
    );
};

export default ViewCoupons;
