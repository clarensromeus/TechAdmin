import * as React from 'react';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PersonIcon from '@mui/icons-material/Person';
import orange from '@mui/material/colors/orange';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ShareIcon from '@mui/icons-material/Share';

interface IMenuLogOut {
  Icon: React.ReactElement;
  clientName: string;
}

interface IMenu {
  Option: string;
  Icon: React.ReactElement;
}

const MenuLogOut: IMenuLogOut[] = [
  {
    clientName: 'Administrator',
    Icon: <ManageAccountsIcon sx={{ color: orange[700] }} />,
  },
  {
    clientName: 'Student',
    Icon: <PersonIcon sx={{ color: orange[700] }} />,
  },
];

const MenuLoggedIn: IMenu[] = [
  {
    Option: 'Profile',
    Icon: <AccountCircleIcon sx={{ color: orange[700] }} />,
  },
  {
    Option: 'Lock',
    Icon: <LockOpenOutlinedIcon sx={{ color: orange[700] }} />,
  },
  {
    Option: 'settings',
    Icon: <SettingsOutlinedIcon sx={{ color: orange[700] }} />,
  },
  {
    Option: 'LogOut',
    Icon: <PowerSettingsNewIcon sx={{ color: orange[700] }} />,
  },
];

const MenuCard: IMenu[] = [
  {
    Option: 'Edit',
    Icon: <EditIcon sx={{ color: 'text.secondary' }} />,
  },
  {
    Option: 'Delete',
    Icon: <DeleteIcon sx={{ color: 'text.secondary' }} />,
  },
  {
    Option: 'Share',
    Icon: <ShareIcon sx={{ color: 'text.secondary' }} />,
  },
];

export { MenuLogOut, MenuLoggedIn, MenuCard };
