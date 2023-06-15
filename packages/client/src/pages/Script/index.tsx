import { DeleteButton } from '@/components';
import { DataType } from '@/pages/Task';
import {
  ScriptControllerRemove,
  ScriptControllerSearch,
} from '@/services/script';
import { DeleteOutlined, FormOutlined, PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  PageContainer,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Button } from 'antd';
import { useRef } from 'react';
// import Subscribe from './components/Subscribe';

const Script = () => {
  const actionRef = useRef<ActionType>();
  const toolBarRender = () => {
    return [
      // <Subscribe
      //   key={'subscribe'}
      //   onSuccess={() => actionRef.current?.reload()}
      // />,
      <Button
        key={'create'}
        type={'primary'}
        icon={<PlusOutlined />}
        onClick={() => history.push('/script/create')}
      >
        新建
      </Button>,
    ];
  };
  const columns: ProColumns<DataType>[] = [
    {
      title: '脚本名称',
      width: '200px',
      dataIndex: 'name',
    },
    {
      title: '版本',
      width: '70px',
      dataIndex: 'version',
      hideInSearch: true,
    },
    {
      title: '描述',
      width: '160px',
      dataIndex: 'description',
      hideInSearch: true,
    },
    {
      title: 'language',
      width: '90px',
      dataIndex: 'language',
      hideInSearch: true,
    },
    {
      title: '更新地址',
      width: '260px',
      ellipsis: true,
      copyable: true,
      dataIndex: 'updateURL',
      hideInSearch: true,
    },
    {
      title: '更新时间',
      width: '170px',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      hideInSearch: true,
      sorter: true,
      defaultSortOrder: 'descend',
    },
    {
      title: '创建时间',
      width: '170px',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
      hideInSearch: true,
      render: (text, record) => [
        <Button
          key={'edit'}
          type={'link'}
          size={'small'}
          onClick={() => history.push(`/script/update/${record.id}`)}
        >
          <FormOutlined />
        </Button>,
        <DeleteButton
          key={'delete'}
          title={`确认删除【${record.name}】吗？`}
          onOk={async () => {
            const { success } = await ScriptControllerRemove({ id: record.id });
            if (success) actionRef.current?.reload();
          }}
        >
          <DeleteOutlined />
        </DeleteButton>,
      ],
    },
  ];
  return (
    <PageContainer>
      <ProTable
        rowKey={'id'}
        columns={columns}
        scroll={{ x: 1300 }}
        actionRef={actionRef}
        toolBarRender={toolBarRender}
        request={(params, sort, filter) =>
          ScriptControllerSearch({ params, sort, filter })
        }
      />
    </PageContainer>
  );
};

export default Script;
