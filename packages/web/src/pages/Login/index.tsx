import Footer from '@/components/Footer';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormCheckbox, ProFormText } from '@ant-design/pro-components';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { history, useModel, Helmet,useRequest} from '@umijs/max';
import { Alert } from 'antd';
import Settings from '../../../../config/defaultSettings';
import { flushSync } from 'react-dom';
import {login} from "@/services/login";

const Login: React.FC = () => {
    const {data,run} = useRequest(login,{manual:true});
    const { initialState, setInitialState } = useModel('@@initialState');
    const containerClassName = useEmotionCss(() => {
        return {
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            overflow: 'auto',
            backgroundImage:
                "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
            backgroundSize: '100% 100%',
        };
    });
    const fetchUserInfo = async () => {
        const userInfo = await initialState?.fetchUserInfo?.();
        if (userInfo) {
            flushSync(() => {
                setInitialState((s) => ({
                    ...s,
                    currentUser: userInfo,
                }));
            });
        }
    };
    const handleSubmit = async (values: API.LoginDto) => {
        const {authority} = await run(values);
        localStorage.setItem("authorization",`Bearer ${authority}`)
        await fetchUserInfo();
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/');
    };
    return (
        <div className={containerClassName}>
            <Helmet>
                <title>
                    {'登录'}- {Settings.title}
                </title>
            </Helmet>
            <div
                style={{
                    flex: '1',
                    padding: '32px 0',
                }}
            >
                <LoginForm
                    contentStyle={{
                        minWidth: 280,
                        maxWidth: '75vw',
                    }}
                    logo={<img alt="logo" src="/logo.svg" />}
                    title="Ant Design"
                    subTitle={'Ant Design 是西湖区最具影响力的 Web 设计规范'}
                    initialValues={{
                        autoLogin: true,
                    }}
                    onFinish={async (values) => {
                        await handleSubmit(values as API.LoginDto);
                    }}
                >
                    {data?.errorMessage && <Alert
											style={{
                          marginBottom: 24,
                      }}
											message={data.errorMessage}
											type="error"
											showIcon
										/>}
                    <ProFormText
                        name="username"
                        fieldProps={{
                            size: 'large',
                            prefix: <UserOutlined />,
                        }}
                        placeholder={'用户名: admin or user'}
                        rules={[
                            {
                                required: true,
                                message: '用户名是必填项！',
                            },
                        ]}
                    />
                    <ProFormText.Password
                        name="password"
                        fieldProps={{
                            size: 'large',
                            prefix: <LockOutlined />,
                        }}
                        placeholder={'密码: ant.design'}
                        rules={[
                            {
                                required: true,
                                message: '密码是必填项！',
                            },
                        ]}
                    />
                    {/*<div*/}
                    {/*    style={{*/}
                    {/*        marginBottom: 24,*/}
                    {/*    }}*/}
                    {/*>*/}
                    {/*    <ProFormCheckbox noStyle name="autoLogin">*/}
                    {/*        自动登录*/}
                    {/*    </ProFormCheckbox>*/}
                    {/*    <a*/}
                    {/*        style={{*/}
                    {/*            float: 'right',*/}
                    {/*        }}*/}
                    {/*    >*/}
                    {/*        忘记密码 ?*/}
                    {/*    </a>*/}
                    {/*</div>*/}
                </LoginForm>
            </div>
            <Footer />
        </div>
    );
};
export default Login;
