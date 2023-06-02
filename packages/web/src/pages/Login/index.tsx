import { AuthControllerLogin } from '@/services/auth';
import { LockTwoTone,MailTwoTone } from '@ant-design/icons';
import { LoginForm, ProFormText} from '@ant-design/pro-components';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { Helmet,history,useModel } from '@umijs/max';
import CryptoJS from 'crypto-js';
import { flushSync } from 'react-dom';
import { defaultSettings } from '../../../config/defaultSettings';

const Login: React.FC = () => {
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
    return userInfo;
  };
  const onFinish = async (values: any) => {
    const { data } = await AuthControllerLogin({
      email: values.email,
      password: CryptoJS.SHA256(values.password).toString(),
    });
    localStorage.setItem('authorization', `Bearer ${data.accessToken}`);
    const userInfo = await fetchUserInfo();
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
          logo={<img alt="logo" src="/logo.svg" />}
          contentStyle={{ minWidth: 280, maxWidth: '75vw' }}
          subTitle={'Ant Design 是西湖区最具影响力的 Web 设计规范'}
          submitter={{ searchConfig: { submitText: '登录 / 注册' } }}
        >
          <ProFormText
            name="email"
            placeholder={'邮箱'}
            fieldProps={{ size: 'large', prefix: <MailTwoTone /> }}
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email' },
            ]}
          />
          <ProFormText.Password
            name="password"
            placeholder={'密码'}
            fieldProps={{ size: 'large', prefix: <LockTwoTone /> }}
            rules={[
              { required: true, message: '请输入密码' },
              { min: 4 },
              { max: 20 },
            ]}
          />
        </LoginForm>
      </div>
    </div>
  );
};
export default Login;
