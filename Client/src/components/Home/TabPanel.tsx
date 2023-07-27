import * as React from 'react';

interface TabPanelProps {
  children: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index } = props;
  const postchildren = value === index && children;
  return <div>{postchildren}</div>;
};

export default TabPanel;
