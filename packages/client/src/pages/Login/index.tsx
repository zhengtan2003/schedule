import { AuthControllerLogin } from '@/services/auth';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { Helmet, history, useModel } from '@umijs/max';
import { Button, Divider } from 'antd';
import CryptoJS from 'crypto-js';
import { flushSync } from 'react-dom';
import { defaultSettings } from '../../../config/defaultSettings';

const Login: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const { connect } = useModel('socket');
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
    return userInfo;
  };
  const onFinish = async (values: any) => {
    const { data } = await AuthControllerLogin({
      username: values.username,
      password: CryptoJS.SHA256(values.password).toString(),
    });
    localStorage.setItem('authorization', `Bearer ${data.accessToken}`);
    await fetchUserInfo();
    connect();
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
      <div className={'flex-1 py-32'}>
        <LoginForm
          title="Schedule"
          onFinish={onFinish}
          subTitle={'🪐 笔落惊风雨，诗成泣鬼神。'}
          logo={<img alt="logo" src="/logo.jpg" />}
          contentStyle={{ minWidth: 280, maxWidth: '75vw' }}
          actions={
            <div>
              <Divider plain>
                <span
                  style={{ color: '#CCC', fontWeight: 'normal', fontSize: 14 }}
                >
                  其他登录方式
                </span>
              </Divider>
              <Button
                block
                size={'large'}
                onClick={() => {
                  onFinish({
                    username: 'tourist',
                    password:
                      '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',
                  });
                }}
              >
                游客模式登录
              </Button>
            </div>
          }
          submitter={{ searchConfig: { submitText: '登录 / 注册' } }}
        >
          <ProFormText
            name="username"
            placeholder={'用户名'}
            fieldProps={{ size: 'large', prefix: <UserOutlined /> }}
            rules={[{ required: true, message: '请输入用户名' }]}
          />
          <ProFormText.Password
            name="password"
            placeholder={'密码'}
            fieldProps={{ size: 'large', prefix: <LockOutlined /> }}
            rules={[{ required: true, message: '请输入密码' }]}
          />
        </LoginForm>
      </div>
    </div>
  );
};
export default Login;
