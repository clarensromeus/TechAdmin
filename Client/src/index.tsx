// internal imports of sources
import React from "react";
import { createRoot } from "react-dom/client";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import grey from "@mui/material/colors/grey";
import red from "@mui/material/colors/red";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import { RecoilRoot } from "recoil";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  SnackbarProvider,
  MaterialDesignContent,
  closeSnackbar,
} from "notistack";
// internal crafted imports of sources
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const theme = createTheme();
const queryClient = new QueryClient();

// notistack global style overriding
const StyledMaterialDesignContent = styled(MaterialDesignContent)(() => ({
  "&.notistack-MuiContent-success": {
    backgroundColor: "#e8f5e9",
    boxShadow: "none",
  },

  "&.notistack-MuiContent-error": {
    backgroundColor: red[50],
    boxShadow: "none",
  },
}));

// upgrading to react 18
const container = document.getElementById("root");
const root = createRoot(container!); // createRoot(container!) if you're using typescript
root.render(
  <ThemeProvider theme={theme}>
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider
        disableWindowBlurListener // for closing snack out of window focus
        iconVariant={{
          success: "✅",
        }}
        action={(snackbarId) => (
          <IconButton onClick={() => closeSnackbar(snackbarId)}>
            <CloseIcon sx={{ color: grey[600] }} />
          </IconButton>
        )}
        Components={{
          success: StyledMaterialDesignContent,
          error: StyledMaterialDesignContent,
        }}
        dense
      >
        <RecoilRoot>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </RecoilRoot>
      </SnackbarProvider>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  </ThemeProvider>
);

reportWebVitals();
