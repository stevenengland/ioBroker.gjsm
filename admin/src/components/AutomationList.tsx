import { Typography } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import React from 'react';
import { useInject } from '../hooks/useInject';
import { TranslationInterface } from '../translation/TranslationInterface';

interface AutomationListProps {
  items: string[];
}

function AutomationList({ items }: AutomationListProps) {
  const i18n = useInject<TranslationInterface>('i18n');
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  return (
    <>
      <Typography variant="h6">{i18n.translate('$TAB_LIST_HEADER')}</Typography>
      <List>
        {items.map((item, index) => (
          <ListItem key={index}>
            <ListItemButton
              selected={selectedIndex === index}
              onClick={() => {
                setSelectedIndex(index);
              }}
            >
              {item}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );
}

export default AutomationList;
