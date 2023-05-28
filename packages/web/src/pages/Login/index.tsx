import {flushSync} from 'react-dom';
import {authLogin} from "@/services/auth";
import {useEmotionCss} from '@ant-design/use-emotion-css';
import {LockTwoTone, MailTwoTone} from '@ant-design/icons';
import {defaultSettings} from '../../../config/defaultSettings';
import {history, useModel, Helmet, useRequest} from '@umijs/max';
import {LoginForm, ProFormText} from '@ant-design/pro-components';

const Login: React.FC = () => {
    const {data, run} = useRequest(authLogin, {manual: true});
    const {initialState, setInitialState} = useModel('@@initialState');
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
        const {accessToken} = await run(values);
        localStorage.setItem("authorization", `Bearer ${accessToken}`)
        await fetchUserInfo();
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/');
    };
    return (
        <div className={containerClassName}>
            <Helmet>
                <title>
                    {'登录'}- {defaultSettings.title}
                </title>
            </Helmet>
            <div className={"flex-1 py-32"}>
                <LoginForm title="Schedule"
                           logo={<img alt="logo" src="/logo.svg"/>}
                           contentStyle={{minWidth: 280, maxWidth: '75vw'}}
                           subTitle={'Ant Design 是西湖区最具影响力的 Web 设计规范'}
                           submitter={{ searchConfig: { submitText: '登录 / 注册'}}}
                           onFinish={async (values) => {
                               await handleSubmit(values as API.LoginDto);
                           }}>
                    <ProFormText
                        name="email"
                        fieldProps={{
                            size: 'large',
                            prefix: <MailTwoTone/>
                        }}
                        placeholder={'邮箱'}
                        rules={[{required: true}]}/>
                    <ProFormText.Password
                        name="password"
                        fieldProps={{
                            size: 'large',
                            prefix: <LockTwoTone/>,
                        }}
                        placeholder={'密码'}
                        rules={[{required: true}]}/>
                </LoginForm>
            </div>
        </div>
    );
};
export default Login;
