import {
  Outlet,
  createRootRoute,
  useNavigate,
  useLocation
} from "@tanstack/react-router";
import { Layout, Menu, theme } from "antd";
import { DownloadOutlined, UnorderedListOutlined } from "@ant-design/icons";

const { Content, Sider, Header } = Layout;

export const Route = createRootRoute({
  component: () => {
    const {
      token: { colorBgContainer, borderRadiusLG }
    } = theme.useToken();
    const navigate = useNavigate();
    const location = useLocation();

    const handleClickMenuItem = ({ key }: { key: string }) => {
      navigate({ to: key });
    };

    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Header style={{ color: "white", fontSize: 20 }}>
          Атом.Хайлайты
        </Header>
        <Layout>
          <Sider
            style={{ background: colorBgContainer }}
            width={210}
          >
            <Menu
              defaultSelectedKeys={[location.pathname]}
              mode="inline"
              onClick={handleClickMenuItem}
              items={[
                {
                  label: "Загрузка видео",
                  key: "/",
                  icon: <DownloadOutlined />
                },
                {
                  label: "Загруженные видео",
                  key: "/video",
                  icon: <UnorderedListOutlined />
                }
              ]}
            />
          </Sider>
          <Layout style={{ height: "calc(100vh - 64px)" }}>
            <Content style={{ padding: "32px 32px", overflow: "auto" }} id="content">
              <div
                style={{
                  padding: 24,
                  minHeight: 360,
                  background: colorBgContainer,
                  borderRadius: borderRadiusLG
                }}>
                <Outlet />
              </div>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
});
