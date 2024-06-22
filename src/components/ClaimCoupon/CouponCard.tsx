import React, { useState, useEffect } from 'react';
import { PlusCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { Avatar, Card, Popover, Input, Button } from 'antd';
import { claim_coupon, access_contract_adress, burn, check_if_claimed } from '../../utils/operation';

import './styles.css';
const { Meta } = Card;

const CouponCard = ({
  index,
  image_src,
  coupon_code,
  description,
  merchant,
  expiration_date,
  disable,
}: {
  index: number;
  image_src: string;
  coupon_code: string;
  description: string;
  merchant: string;
  expiration_date: string;
  disable: boolean;
}) => {
  const [claimed, setClaimed] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [validCoupon, setValidCoupon] = useState(false);

  useEffect(() => {
    const fetchClaimedStatus = async () => {
      try {
        const isClaimed = await check_if_claimed(index);
        setClaimed(isClaimed);
      } catch (error) {
        console.error('Error fetching claimed status:', error);
      }
    };

    fetchClaimedStatus();
  }, [index]);

  const handleClaimCoupon = async () => {
    try {
      const contractAddress = await access_contract_adress(index);
      console.log('Contract Address:', contractAddress);

      if (!contractAddress) {
        throw new Error('Contract address not found');
      }

      await claim_coupon(contractAddress);

      setClaimed(true)
    } catch (error) {
      console.error('Error claiming coupon:', error);
    }
  };

  const handleBurningCoupon = async () => {
    try {
      const contractAddress = await access_contract_adress(index);
      console.log('Contract Address:', contractAddress);

      if (!contractAddress) {
        throw new Error('Contract address not found');
      }

      await burn(contractAddress);
    } catch (error) {
      console.error('Error burning coupon:', error);
    }
  };

  const handleCouponInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCouponInput(e.target.value.toUpperCase());
    setValidCoupon(e.target.value.toUpperCase() === coupon_code);
  };

  const handleClaimButtonClick = () => {
    if (validCoupon) {
      handleClaimCoupon();
    }
  };

  return (
    <Card
      style={{ width: 300, margin: '10px' }}
      cover={<img alt="example" src={image_src} />}
      actions={
        disable 
          ? []
          : claimed
          ? [<DeleteOutlined key="burn" rev={undefined} onClick={handleBurningCoupon} />]
          : [
              <Popover
                key="claim"
                content={
                  <div>
                    <Input placeholder="Insert Coupon Code here" value={couponInput} onChange={handleCouponInputChange} />
                    <Button onClick={handleClaimButtonClick} disabled={!validCoupon}>
                      Claim
                    </Button>
                  </div>
                }
                title="Coupon Code Verification"
                trigger="click"
              >
                <PlusCircleOutlined  rev={undefined} />
              </Popover>,
            ]
      }
    >
      <div className="cpn-merchant">{merchant}</div>
      <span className="hor-line">&#183;</span>
      <div className="cpn-valid-until">VALID UNTIL {expiration_date}</div>
      <hr className="solid"></hr>
      <div className="cpn-description">{description}</div>
    </Card>
  );
};

export default CouponCard;
