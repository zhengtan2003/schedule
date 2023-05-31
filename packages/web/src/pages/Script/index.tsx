import { PageContainer, ProColumns, ProTable } from "@ant-design/pro-components";
import { DataType } from "@/pages/Task";

const Script = () => {
  const columns: ProColumns<DataType>[] = [
    {
      title: "脚本名称",
      width: "200px",
      dataIndex: 'name',
    },
    {
      title: "版本",
      width: "70px",
      dataIndex: "version",
      hideInSearch: true,
    },
    {
      title: "更新地址",
      width: "260px",
      ellipsis: true,
      copyable: true,
      dataIndex: "updateURL",
      hideInSearch: true,
    },
    {
      title: "更新时间",
      width: "170px",
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      hideInSearch: true
    },
    {
      title: "创建时间",
      width: "170px",
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInSearch: true
    },
  ]
  return (
    <PageContainer>
      <ProTable
        rowKey={'id'}
        // request={request}
        columns={columns}
        scroll={{ x: 1300 }}
        // actionRef={actionRef}
        // toolBarRender={toolBarRender}
      />
    </PageContainer>
  );
};

export default Script;
