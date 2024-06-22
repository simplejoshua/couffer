import React, { useState, useEffect } from 'react';
import CouponCard from './CouponCard';
import './styles.css';
import { access_contract, contract_count } from '../../utils/operation';
import { fetchStorage } from '../../utils/tzkt';
import dayjs, { Dayjs } from 'dayjs';

// Interface representing the shape of the NFT contract object
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

const ClaimCoupon = () => {
  const [NFTContracts, setNFTContracts] = useState<NFTContractType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCards, setShowCards] = useState(false);

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

  // Helper function to convert bytes to a string
  const bytes2char = (bytes: Uint8Array) => {
    const decoder = new TextDecoder();
    return decoder.decode(bytes);
  };

  // Helper function to convert a hexadecimal string to a Uint8Array
  const hexToUint8Array = (hex: string): Uint8Array => {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    return bytes;
  };

  // Event handler for the search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Filter the NFTContracts based on the search term
  const filteredContracts = NFTContracts.filter((contract) => {
    const couponCode = bytes2char(hexToUint8Array(contract.coupon_code));
    return couponCode.toLowerCase() === searchTerm.toLowerCase();
  });

  // Event handler for the "Submit" button
  const handleCouponCodeSubmit = () => {
    if (searchTerm.trim() === '') {
      // If search input is empty, do nothing
      return;
    }
    setShowCards(true);
  };

  // return (
  //   <div className="claim-coupon flex-wrap">
  //     <div style={{ width: '100%' }}>
  //       <h1 className="claim-page-title">CLAIM COUPONS</h1>
  //     </div>

  //     <div className="searchbar">
  //       <input
  //         type="text"
  //         placeholder="Search coupon code"
  //         value={searchTerm}
  //         onChange={handleSearchChange}
  //       />
  //       <button className="search-button" onClick={handleCouponCodeSubmit}>
  //         Search
  //       </button>
  //     </div>

  //     {showCards && searchTerm.trim() !== '' && filteredContracts.length > 0 ? (
  //       <div className="result">
  //         {filteredContracts.map((contract, index) => (
  //           <CouponCard
  //             key={index}
  //             index={index}
  //             image_src={bytes2char(hexToUint8Array(contract.image_url))}
  //             coupon_code={bytes2char(hexToUint8Array(contract.coupon_code))}
  //             description={bytes2char(hexToUint8Array(contract.description))}
  //             expiration_date={dayjs
  //               .unix(contract.expiration_date)
  //               .format('MMM DD, YYYY')}
  //             merchant={bytes2char(hexToUint8Array(contract.merchant))}
  //             disable={false}
  //           />
  //         ))}
  //       </div>
  //     ) : (
  //       <div className="result">
  //         {NFTContracts.length === 0 ? (
  //           <div>No coupons available</div>
  //         ) : filteredContracts.length === 0 && showCards ? (
  //           <div>Coupon code not existing</div>
  //         ) : null}
  //       </div>
  //     )}
  //   </div>
  // );
  
  return (
    <div className='claim-coupon flex-wrap'>
      <div style={{ width: '100%' }}>
        <h1 className='claim-page-title'>CLAIM COUPONS</h1>
      </div>
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
              expiration_date={dayjs
                .unix(contract.expiration_date)
                .format('MMM DD, YYYY')}
              merchant={bytes2char(hexToUint8Array(contract.merchant))}
              disable={false}
            />
        ))
      )}
    </div>
  );
};

export default ClaimCoupon;
