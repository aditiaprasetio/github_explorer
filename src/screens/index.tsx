import { useState } from 'react';
import { Button, Card, Collapse, Empty, Form, Input, notification } from 'antd';
import { octokit } from '../libs/octokit';
// import { useDebounce } from 'use-debounce';
import UserRepositories from '../components/UserRepositories';
import Paragraph from 'antd/es/typography/Paragraph';

const FETCH_USERS_LIMIT = 5;

function MainApp() {
  const [isLoading, setIsLoading] = useState(false);
  const [keyword, setKeyword] = useState<string>('');
  // const [searchKeyword] = useDebounce(keyword, 500);

  const [isResponseExist, setIsResponseExist] = useState<boolean>(false);
  const [users, setUsers] = useState<{username: string, name: string}[]>([]);

  // useEffect(() => {
  //   if (searchKeyword) {
  //     onSearch(searchKeyword);
  //   } else {
  //     setUsers([]);
  //   }
  // }, [searchKeyword]);

  const onChangeKeyword = (value: string) => {
    if (!value) {
      setKeyword('');
      setIsResponseExist(false);
      setUsers([]);
      return;
    }

    setKeyword(value);
  }

  const onSearch = async (value: string) => {
    console.info('onSearch', value);

    setIsLoading(true);
    if (!value) {
      setIsResponseExist(false);
      setUsers([]);
      setIsLoading(false);
      return;
    }

    try {
      const res = await octokit.request('GET /search/users', {
        q: value,
        per_page: FETCH_USERS_LIMIT,
      });

      if (res.data) {
        console.info('res.data', res.data);

        setUsers(res.data.items.map(item => ({
          username: item.login,
          name: item.name || item.login,
        })));
        setIsResponseExist(true);
      } else {
        setIsResponseExist(false);
      }
      setIsLoading(false);
    } catch (err) {
      notification.error({
        message: 'Failed to search user',
      });
      setIsResponseExist(false);
      console.error(err);
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <Form onFinish={() => onSearch(keyword)}>
        <Form.Item htmlFor='keyword'>
          <Input
            id="keyword"
            placeholder="Enter username"
            // onSearch={onSearch}
            onChange={(event) => onChangeKeyword(event.target.value)}
            allowClear
          />
        </Form.Item>
        <Button
          onClick={() => onSearch(keyword)}
          block
          type="primary"
          loading={isLoading}
        >
          Search
        </Button>
      </Form>

      {!isLoading && !!keyword && isResponseExist && (
        <Paragraph style={{ color: 'gray' }}>
          Showing users for "{keyword}"
        </Paragraph>
      )}

      {isResponseExist && users.length === 0 && <Empty />}
      {isResponseExist && users.length > 0 && (
        <Collapse
          accordion
          collapsible="header"
          defaultActiveKey={['1']}
          items={users.map((user) => ({
            key: user.username,
            label: user.username,
            children: <UserRepositories username={user.username} />,
          }))}
        />
      )}
    </Card>
  );
}

export default MainApp;
