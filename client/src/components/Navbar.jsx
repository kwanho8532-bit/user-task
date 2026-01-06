import {
    AppBar,
    Box,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Drawer,
    List,
    Divider,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router'
import HomeFilledIcon from '@mui/icons-material/HomeFilled';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import ListAltIcon from '@mui/icons-material/ListAlt';
import LoginIcon from '@mui/icons-material/Login';
import { useAuth } from '../AuthContext';
import api from '../api/axios';

export default function Navbar() {
    const [open, setOpen] = useState(false);

    const { user, setUser } = useAuth()

    const navigate = useNavigate()

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    const signOut = async () => {
        try {
            const result = await api.get('/signout')
            console.log(result.data)
            setUser(null)
            navigate('/list')
        } catch (err) {
            console.log(err)
        }
    }

    const drawerMenus = [
        {
            label: 'Home',
            icon: <HomeFilledIcon />,
            to: '/home'
        },
        {
            label: 'SignUp',
            icon: <AssignmentIndIcon />,
            to: '/signup'
        },
        {
            label: 'SignIn',
            icon: <LoginIcon />,
            to: '/signin'
        },
        {
            label: 'List',
            icon: <ListAltIcon />,
            to: '/list'
        },

    ]

    const DrawerList = (
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
            {user ?
                <Typography variant="subtitle2">
                    🟢
                </Typography>
                :
                <Typography variant="subtitle2" >
                    🔴
                </Typography>
            }
            <List>
                {drawerMenus.map(menu => (
                    <ListItem key={menu.label} disablePadding>
                        <ListItemButton component={NavLink} to={menu.to}>
                            <ListItemIcon>
                                {menu.icon}
                            </ListItemIcon>
                            <ListItemText primary={menu.label} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
        </Box>
    );

    return (
        <header>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" elevation={0}>
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            onClick={toggleDrawer(true)}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            U&T Manager
                        </Typography>
                        {!user ?
                            <>
                                <Button color="inherit" component={NavLink} to={'/signup'}>SignUp</Button>
                                <Button color="inherit" component={NavLink} to={'/signin'}>SignIn</Button>
                            </>
                            :
                            <Button color="inherit" onClick={signOut} component={NavLink} to={'/signout'}>SignOut</Button>
                        }
                    </Toolbar>
                </AppBar>
                <Drawer open={open} onClose={toggleDrawer(false)}>
                    {DrawerList}
                </Drawer>
            </Box>
        </header>
    )
}