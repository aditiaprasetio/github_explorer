import { useEffect, useState } from 'react';
import { Col, Row, Spin } from 'antd';
import { octokit } from '../libs/octokit';
import Paragraph from 'antd/es/typography/Paragraph';
import { StarFilled } from '@ant-design/icons';

type Props = {
  username: string;
}

function UserRepositories(props: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [repositories, setRepositories] = useState<{ name: string; description: string | null; countStar: number; url: string }[]>([]);

  useEffect(() => {
    fetchRepositories();
  }, []);

  const fetchRepositories = async () => {
    console.info('fetchRepositories');

    setIsLoading(true);
    try {
      const res = await octokit.request('GET /users/{username}/repos', {
        username: props.username,
      });

      if (res.data) {
        console.info('res.data', res.data);

        setRepositories(
          res.data.map((item) => ({
            name: item.name,
            description: item.description,
            countStar: item.stargazers_count || 0,
            url: item.html_url,
          }))
        );
      }
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoading && <Spin />}
      <div>
        {!isLoading && repositories.length === 0 && (
          <Paragraph italic style={{ color: 'gray', fontSize: 12 }}>
            No repositories
          </Paragraph>
        )}
        {!isLoading &&
          repositories.map((repo) => (
            <a href={repo.url} target="_blank" rel="noreferrer">
              <div
                key={repo.name}
                style={{
                  borderRadius: 10,
                  background: '#f2f2f2',
                  width: '100%',
                  padding: 10,
                  marginBottom: 10,
                }}
              >
                <Row justify="space-between">
                  <Col>
                    <div style={{ fontWeight: 'bold' }}>{repo.name}</div>
                  </Col>
                  <Col>
                    {repo.countStar} <StarFilled />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    {repo.description ? (
                      <Paragraph>{repo.description}</Paragraph>
                    ) : (
                      <Paragraph italic style={{ color: 'gray', fontSize: 12 }}>
                        No description
                      </Paragraph>
                    )}
                  </Col>
                </Row>
              </div>
            </a>
          ))}
      </div>
    </div>
  );
}

export default UserRepositories;
