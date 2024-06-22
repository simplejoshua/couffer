import React, { Component, useState } from 'react';
import { Popconfirm, Spin, message } from 'antd';

import { char2Bytes } from '@taquito/utils';
import { Button, Cascader, DatePicker, Form, Input, InputNumber } from 'antd';
import dayjs, { Dayjs } from 'dayjs';

import './styles.css';

import { nanoid } from 'nanoid';

import { storage } from '../../utils/firebase';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { create_couponNFT_contract } from '../../utils/operation';
import { SingleValueType } from 'rc-cascader/lib/Cascader';
import CouponCard from '../ClaimCoupon/CouponCard';


const { TextArea } = Input;

let couponId = Math.floor(Math.random() * 10000000 + 1);
const dateNow: number = Math.floor(Date.now() / 1000);

const CreateCoupons = () => {
    const casc_list: SingleValueType = ['', ''];

    const [merchant, setMerchant] = useState(casc_list);

    const handleMerchant = (value: SingleValueType) => {
        // 👇 Get input value from "event"
        setMerchant(value);
    };

    const [couponCode, setCouponCode] = useState('');
    const handleCouponCode = (value: string) => {
        const re = /^[A-Za-z][A-Za-z0-9]*$/;
        if (value === '' || re.test(value)) {
            setCouponCode(value.toUpperCase());
        }
    };

    const [couponDesc, setCouponDesc] = useState('');
    const handleCouponDesc = (value: string) => {
        setCouponDesc(value);
    };

    const [validity, setValidity] = useState(dateNow);
    const handleValidity = (value: Dayjs | null) => {
        if (value != null) {
            setValidity(value.unix());
        }
    };

    const [couponSupply, setCouponSupply] = useState(1);
    const handleSupply = (value: number | null) => {
        if (value != null) {
            setCouponSupply(value);
        }
    };

    const [imageFile, setImageFile] = useState<File>();
    const [downloadURL, setDownloadURL] = useState('');
    const [displayURL, setDisplayURL] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [progressUpload, setProgressUpload] = useState(0);

    const handleSelectedFile = (files: any) => {
        if (files && files[0].size < 10000000) {
            setImageFile(files[0]);
            console.log(files[0]);
            let fileReader = new FileReader();
            fileReader.readAsDataURL(files[0]); 
            fileReader.onload = function (){
                if (fileReader.result != null)
                setDisplayURL(fileReader.result.toString())
            }
        } else {
            message.error('File size too large.');
        }
    };


    const handleSubmit = async () => {
        setIsUploading(true);
        if (imageFile) {
            const name = imageFile.name;
            const storageRef = ref(storage, `image/${name + nanoid(8)}`);
            const uploadTask = uploadBytesResumable(storageRef, imageFile);
            
            await uploadTask;
            
            const download = getDownloadURL(uploadTask.snapshot.ref).then(url => {
                //url is download url of file
                setDownloadURL(url);

                console.log('couponSupply: ' + couponSupply);
                console.log('merchant: ' + char2Bytes(merchant[1].toString()));
                console.log('validity: ' + dayjs.unix(validity));
                console.log('couponCode: ' + char2Bytes(couponCode));
                console.log('couponId: ' + couponId);
                console.log('couponDesc: ' + char2Bytes(couponDesc));
                console.log('metadata: ' + url);
    
                create_couponNFT_contract(
                    couponSupply,
                    merchant[1].toString(),
                    validity,
                    couponCode,
                    couponId,
                    couponDesc,
                    url,
                    {}
                );
            });

            await download;

            couponId = Math.floor(Math.random() * 10000000 + 1);

            setIsUploading(false);
            setOpen(false);

        } else {
            message.error('File not found');
            setIsUploading(false);
            setOpen(false);
        }
        
    };

    const [open, setOpen] = useState(false);
  
    const showPopconfirm = () => {
      setOpen(true);
    };
  
  
    const handleCancel = () => {
      console.log('Clicked cancel button');
      setOpen(false);
    };

    return (
        <div className="create-coupons">
            <h1> CREATE COUPONS </h1>

            <br />
            <br />

            <Form
                labelCol={{ span: 12 }}
                wrapperCol={{ span: 12 }}
                layout="horizontal"
                style={{ maxWidth: 500 }}
                labelAlign="left"
                // onFinish={handleSubmit}
            >
                <Form.Item label="Merchant">
                    <Cascader
                        placeholder="Category / Partner Store"
                        value={merchant}
                        expandTrigger="hover"
                        onChange={value => handleMerchant(value)}
                        options={[
                            {
                                value: 'restaurant',
                                label: 'Restaurant',
                                children: [
                                    {
                                        value: 'Burgerbyte',
                                        label: 'Burgerbyte',
                                    },
                                    {
                                        value: 'Eatsy',
                                        label: 'Eatsy',
                                    },
                                    {
                                        value: 'Grill Galaxy',
                                        label: 'Grill Galaxy',
                                    },
                                    {
                                        value: 'Loco Cafe',
                                        label: 'Loco Cafe',
                                    },
                                    {
                                        value: 'Snack Haven',
                                        label: 'Snack Haven',
                                    },
                                ],
                            },
                            {
                                value: 'fashion',
                                label: 'Fashion',
                                children: [
                                    {
                                        value: 'Chictique',
                                        label: 'Chictique',
                                    },
                                    {
                                        value: 'Choice',
                                        label: 'Choice',
                                    },
                                    {
                                        value: 'Dress Domain',
                                        label: 'Dress Domain',
                                    },
                                    {
                                        value: 'Glamour Galleria',
                                        label: 'Glamour Galleria',
                                    },
                                    {
                                        value: 'Urban Soul',
                                        label: 'Urban Soul',
                                    },
                                    {
                                        value: 'Wearista',
                                        label: 'Wearista',
                                    },
                                ],
                            },
                            {
                                value: 'electronics',
                                label: 'Electronics',
                                children: [
                                    {
                                        value: 'Applix',
                                        label: 'Applix',
                                    },
                                    {
                                        value: 'Furvio',
                                        label: 'Furvio',
                                    },
                                    {
                                        value: 'Gadget Gateway',
                                        label: 'Gadget Gateway',
                                    },
                                    {
                                        value: 'Gadget Genius',
                                        label: 'Gadget Genius',
                                    },

                                    {
                                        value: 'Zees',
                                        label: 'Zees',
                                    },
                                    {
                                        value: 'Powermate',
                                        label: 'Powermate',
                                    },
                                    {
                                        value: 'Laplabz',
                                        label: 'Laplabz',
                                    },
                                    {
                                        value: 'Nimbus',
                                        label: 'Nimbus',
                                    },
                                    {
                                        value: 'Tech Haus',
                                        label: 'Tech Haus',
                                    },
                                    {
                                        value: 'Techcite',
                                        label: 'Techcite',
                                    },
                                ],
                            },
                            {
                                value: 'personal-care',
                                label: 'Personal Care',
                                children: [
                                    {
                                        value: 'Barber Box',
                                        label: 'Barber Box',
                                    },
                                    {
                                        value: 'Bliss Booth',
                                        label: 'Bliss Booth',
                                    },
                                    {
                                        value: 'Elite Salon Spa',
                                        label: 'Elite Salon Spa',
                                    },
                                    {
                                        value: 'Graceful Nails',
                                        label: 'Graceful Nails',
                                    },
                                    {
                                        value: 'Polished Plus',
                                        label: 'Polished+',
                                    },
                                    {
                                        value: 'The Cut Crafters',
                                        label: 'The Cut Crafters',
                                    },
                                    {
                                        value: 'Urbanmane',
                                        label: 'Urbanmane',
                                    },
                                ],
                            },
                        ]}
                    />
                </Form.Item>

                <Form.Item label="Coupon Code">
                    <Input
                        placeholder="Create a new coupon code"
                        value={couponCode}
                        onChange={e => handleCouponCode(e.target.value)}
                    />
                </Form.Item>

                <Form.Item label="Coupon ID">
                    <Input value={couponId} disabled />
                </Form.Item>

                <Form.Item label="Coupon Description">
                    <TextArea rows={4} onChange={e => handleCouponDesc(e.target.value)} />
                </Form.Item>

                <Form.Item label="Valid Until">
                    <DatePicker
                        placeholder="YYYY-MM-DD"
                        disabledDate={d => !d || d.isBefore(dayjs.unix(dateNow))}
                        value={dayjs.unix(validity)}
                        onChange={e => handleValidity(e)}
                    />
                </Form.Item>

                <Form.Item label="Coupon Supply">
                    <InputNumber value={couponSupply} min={1} onChange={e => handleSupply(e)} />
                </Form.Item>

                <Form.Item label="Coupon Image">
                    <Input
                        className='image-input'
                        type="file"
                        onChange={files => handleSelectedFile(files.target.files)}
                    ></Input>
                </Form.Item>
                
                <Form.Item label="Coupon Preview">
                    <CouponCard 
                        key={0}
                        index={0}
                        image_src={displayURL}
                        coupon_code={couponCode}
                        description={couponDesc}
                        expiration_date={dayjs.unix(validity).format("MMM DD, YYYY")}
                        merchant={merchant[1].toString()}
                        disable={true}
                    />
                </Form.Item>

                <Form.Item className='submit'>
                    <Popconfirm
                        title="Confirm Coupons Creation"
                        description="Click OK to proceed with the creation of NFT coupons."
                        open={open}
                        onConfirm={handleSubmit}
                        okButtonProps={{ loading: isUploading }}
                        onCancel={handleCancel}
                    >
                        <Button type="primary" onClick={showPopconfirm}>
                            Create Coupons
                        </Button>
                    </Popconfirm>
    
                </Form.Item>

            </Form>
        </div>
    );
};

export default CreateCoupons;
