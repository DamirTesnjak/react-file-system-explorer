const style = {
  components: {
    MuiButton: {
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: "#c0c7c8",
          borderTop: "2px solid #ffffff",
          borderLeft: "2px solid #ffffff",
          borderBottom: "2px solid #020102",
          borderRight: "2px solid #020102",
          borderRadius: "0px",
          color: "black",
          ":hover": {
            borderTop: "2px solid #ffffff",
            borderLeft: "2px solid #ffffff",
            borderBottom: "2px solid #020102",
            borderRight: "2px solid #020102",
          },
          ":active": {
            borderTop: "2px solid #020102",
            borderLeft: "2px solid #020102",
            borderBottom: "2px solid #ffffff",
            borderRight: "2px solid #ffffff",
          },
        },
      },
    },
    MuiInput: {
        styleOverrides: {
            root: {
                backgroundColor: '#ffffff',
                borderTop: "2px solid #020102",
                borderLeft: "2px solid #020102",
                borderBottom: "2px solid #808080",
                borderRight: "2px solid #808080",
            }
        }
    },
    MuiPaper: {
        styleOverrides: {
            root: {
                backgroundColor: "#c0c7c8",
                borderTop: "2px solid #ffffff",
                borderLeft: "2px solid #ffffff",
                borderBottom: "2px solid #020102",
                borderRight: "2px solid #020102",
                borderRadius: "0px",
            }
        }
    },
    MuiAutocomplete: {
        styleOverrides: {
            root: {
                backgroundColor: '#ffffff',
                borderTop: "2px solid #020102",
                borderLeft: "2px solid #020102",
                borderBottom: "2px solid #808080",
                borderRight: "2px solid #808080",
                borderRadius: "0px",
                height: '40px'
            }
        }
    },
    MuiInputBase: {
        styleOverrides: {
            root: {
                borderRadius: "0px",
                height: '40px'
            }
        }
    },
    MuiSimpleTreeView: {
        styleOverrides: {
            root: {
                backgroundColor: '#ffffff',
                MuiTreeItem: {
                    backgroundColor: '#ffffff',
                }
            }
        }
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          ':hover': {
            backgroundColor: '#00134d',
            color: '#ffffff',
          },
        }
      }
    },
    MuiTreeItemContent: {
      styleOverrides: {
        root: {
          ':hover': {
            backgroundColor: '#00134d',
            color: '#ffffff',
          },
        }
      }
    }
  },
};

export default style;
