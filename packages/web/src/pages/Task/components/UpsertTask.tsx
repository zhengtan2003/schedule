import {
    ModalForm,
    ProForm,
    ProFormDateRangePicker,
    ProFormSelect,
    ProFormText,
} from '@ant-design/pro-components';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import CronParser from 'cron-parser';
import { ScriptControllerOptions } from '@/services/script';

const UpsertTask = () => {
    return (
        <ModalForm
            title={'新建任务'}
            trigger={
                <Button type='primary'>
                    <PlusOutlined />
                    新建
                </Button>
            }
            onFinish={async (body) => {
                console.log(body);
            }}
            modalProps={{ destroyOnClose: true }}>
            <ProFormSelect showSearch
                           request={ScriptControllerOptions} />
            <ProFormText
                width='md'
                name='name'
                label='任务名称'
                rules={[{ required: true }]}
            />
            <ProFormText
                width='md'
                name={'cronTime'}
                label={'执行频率'}
                rules={[{ required: true }, {
                    validator: (_, value) => {
                        try {
                            // 尝试解析 Cron 表达式
                            CronParser.parseExpression(value);
                            return Promise.resolve();
                        } catch (error) {
                            return Promise.reject('Cron 表达式无效');
                        }
                    },
                }]} />
            <ProFormDateRangePicker
                width='md'
                label={'生效时间'}
                tooltip={'不填就是无限'}
                name={'effectiveDateRange'}
            />
        </ModalForm>
    );
};

export default UpsertTask;