import React from 'react';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Card } from 'antd';

const { Meta } = Card;

const SampleCard = ({
    image_src,
    title,
    description,
}: {
    image_src: string;
    title: string;
    description: string;
}) => (
    <Card
        style={{ width: 300, margin: '10px' }}
        cover={<img alt="example" src={image_src} />}
        actions={[
            <SettingOutlined key="setting" rev={undefined} />,
            <EditOutlined key="edit" rev={undefined} />,
            <EllipsisOutlined key="ellipsis" rev={undefined} />,
        ]}
    >
        <Meta
            avatar={<Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" />}
            title={title}
            description={description}
        />
    </Card>
);

export default SampleCard;
