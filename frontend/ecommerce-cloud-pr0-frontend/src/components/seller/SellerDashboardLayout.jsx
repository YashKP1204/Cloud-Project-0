import React from 'react';
import { Box, AppBar, Toolbar, Typography, Drawer, List, ListItemButton, ListItemText } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 240;

const SellerDashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { text: 'Dashboard', path: '/seller/dashboard' },
    { text: 'Products', path: '/seller/products' },
    { text: 'Add Product', path: '/seller/products/create' },
    { text: 'Orders', path: '/seller/orders' }, // Placeholder
    { text: 'Analytics', path: '/seller/analytics' }, // Placeholder
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {navItems.map((item) => (
              <ListItemButton
                key={item.text}
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
              >
                <ListItemText primary={item.text} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <Typography variant="h6" noWrap component="div">
              Seller Dashboard
            </Typography>
          </Toolbar>
        </AppBar>

        <Toolbar /> {/* Spacer */}
        {children}
      </Box>
    </Box>
  );
};

export default SellerDashboardLayout;
