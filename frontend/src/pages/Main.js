import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Grid from '@mui/material/Grid';
import Pagination from '@mui/material/Pagination';
import Box from '@mui/material/Box';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import Rating from '@mui/material/Rating';
import NorthWestIcon from '@mui/icons-material/NorthWest';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import background from "../background.gif";
import CatchingPokemonIcon from '@mui/icons-material/CatchingPokemon';
import MapIcon from '@mui/icons-material/Map';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from "react-router-dom";
import {useState, useEffect, useCallback} from 'react';
import axios from "axios";
import { 
  MapContainer, 
  TileLayer, 
  useMap, 
  Marker, 
  Popup
} from 'react-leaflet'
import L from 'leaflet';
import AppBar from '@mui/material/AppBar';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import LogoutIcon from '@mui/icons-material/Logout';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import Popover from '@mui/material/Popover';
import { Dropzone, FileMosaic } from "@files-ui/react";

const markers = []
const polylines = []
const markerRefs = {}
const ratingRefs = {}
const drawerWidth = 240;
const defaultTheme = createTheme()

const base_url = 'http://localhost:8000'

export default function Main() {
  const [user, setUser] = useState();
  const [isAuthenticated, setIsAuthenticated] = useState(false)
 
  // user authentication
  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    const currentToken = localStorage.getItem("token");
    if (loggedInUser) {
      axios.get(base_url+'/check-auth/', { params: { username: loggedInUser, token: currentToken }})
      .then (res => {
        if (res.data.is_authenticated === 'true') {
          setUser(loggedInUser)
          setIsAuthenticated(true)
        }
      })
    }
  }, []);

  const handleLogout = (event) => {
    event.preventDefault();
    const loggedInUser = localStorage.getItem("user");

    axios.get(base_url+'/logout/', { params: { username: loggedInUser }})
    .then(res => {
        if (res.data.success) {
            localStorage.clear()
            window.location.reload()
        }
    })
  };

  // drawer menu
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const [openOne, setOpenOne] = React.useState(true);
  const [openTwo, setOpenTwo] = React.useState(true);

  const handleDropdownOne = () => {
    setOpenOne(!openOne);
  };

  const handleDropdownTwo = () => {
    setOpenTwo(!openTwo);
  };

  // rating (favoriting)

  const [ratingHasChanged, setRatingHasChanged] = useState(false)

  const handleRatingChange = (event, identifier) => {
    event.preventDefault();
    const loggedInUser = localStorage.getItem("user");

    axios.get(base_url+'/favorite-pokemon/', { params: { username: loggedInUser, pokemon_identifier: identifier }})
    .then(res => {
        if (res.data.success) {
            const current_rating = ratingRefs[identifier]
            const new_rating = !current_rating
            ratingRefs[identifier] = new_rating
            setRatingHasChanged(true)
        }
    })
  };

  const [ratingHasChangedTwo, setRatingHasChangedTwo] = useState(false)

  const handleRatingChangeTwo = (event, identifier) => {
    event.preventDefault();
    const loggedInUser = localStorage.getItem("user");

    axios.get(base_url+'/favorite-uploaded-pokemon/', { params: { username: loggedInUser, pokemon_identifier: identifier }})
    .then(res => {
        if (res.data.success) {
            const current_rating = ratingRefs[identifier]
            const new_rating = !current_rating
            ratingRefs[identifier] = new_rating
            setRatingHasChangedTwo(true)
        }
    })
  };

  // stored pokemon
  const [pokemon, setPokemon] = React.useState([]);
  const [dataLoaded, setDataLoaded] = React.useState(false);
  const [pokemonDeleted, setPokemonDeleted] = React.useState(false);
  const [pokemonDeletedTwo, setPokemonDeletedTwo] = React.useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      const loggedInUser = localStorage.getItem("user");

      axios.get(base_url+'/get-pokemon/', { params: { username: loggedInUser }})
      .then(res => {
          if (res.data) {
            const data = res.data
            const items = []
            data.forEach(item => items.push(item))
            items.sort(function (x, y) {
              return (x.favorited === y.favorited) ? 0 : x.favorited ? -1 : 1;
            });
            items.forEach(item => {
              const pokemon_id = item.identifier
              const is_favorited = item.favorited
              ratingRefs[pokemon_id] = is_favorited
            })
            setPokemon(items)
            setPokemonList(items)
            setNoOfPages(Math.ceil(data.length / itemsPerPage))
          }
      })
      .then(res => {
        setDataLoaded(true)
        setPokemonDeleted(false)
        setRatingHasChanged(false)
        if (pokemon.length > 0) {
          setOpenTwo(true)
        }
      })
    }
  }, [isAuthenticated, pokemonDeleted, ratingHasChanged])

  const handleDelete = (event, identifier) => {
    event.preventDefault();
    const loggedInUser = localStorage.getItem("user");

    axios.get(base_url+'/delete-pokemon/', { params: { username: loggedInUser, pokemon_identifier: identifier }})
    .then(res => {
        if (res.data.success) {
            setPokemonDeleted(true)
        }
    })
  };

  const handleDeleteTwo = (event, identifier) => {
    event.preventDefault();
    const loggedInUser = localStorage.getItem("user");

    axios.get(base_url+'/delete-uploaded-pokemon/', { params: { username: loggedInUser, pokemon_identifier: identifier }})
    .then(res => {
        if (res.data.success) {
            setPokemonDeletedTwo(true)
        }
    })
  };

  // uploaded pokemon
  const [uploadedPokemon, setUploadedPokemon] = React.useState([]);
  const [dataLoadedTwo, setDataLoadedTwo] = React.useState(false);
  const [uploadFinished, setUploadFinished] = React.useState(false);

  const handleUploadFinish = () => {
    setUploadFinished(true);
    handlePopoverClose();
  };

  useEffect(() => {
    if (isAuthenticated) {
      const loggedInUser = localStorage.getItem("user");

      axios.get(base_url+'/get-uploaded-pokemon/', { params: { username: loggedInUser }})
      .then(res => {
          if (res.data) {
            const data = res.data
            const items = []
            data.forEach(item => items.push(item))
            items.sort(function (x, y) {
              return (x.favorited === y.favorited) ? 0 : x.favorited ? -1 : 1;
            });
            items.forEach(item => {
              const pokemon_id = item.identifier
              const is_favorited = item.favorited
              ratingRefs[pokemon_id] = is_favorited
            })
            setUploadedPokemon(items)
            setPokemonListTwo(items)
            setNoOfPagesTwo(Math.ceil(data.length / itemsPerPage))
          }
      })
      .then(res => {
        setDataLoadedTwo(true)
        setUploadFinished(false);
        setPokemonDeletedTwo(false)
        setRatingHasChangedTwo(false)
        if (uploadedPokemon.length == 0) {
          setOpenOne(true)
        }
      })
    }
  }, [isAuthenticated, uploadFinished, pokemonDeletedTwo, ratingHasChangedTwo])

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopover = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const popoverOpen = Boolean(anchorEl);
  const popoverId = popoverOpen ? 'simple-popover' : undefined;

  // map popover
  const [anchorElTwo, setAnchorElTwo] = React.useState(null);

  const handlePopoverTwo = (event) => {
    setAnchorElTwo(event.currentTarget);
  };

  const handlePopoverCloseTwo = () => {
    setAnchorElTwo(null);
  };

  const popoverOpenTwo = Boolean(anchorElTwo);
  const popoverIdTwo = popoverOpenTwo ? 'simple-popover' : undefined;

  const [files, setFiles] = React.useState([]);

  const updateFiles = (incommingFiles) => {
    setFiles(incommingFiles);
  };
  const removeFile = (id) => {
    setFiles(files.filter((x) => x.id !== id));
  };

  // clickable popups
  const [leafletMap, setLeafletMap] = React.useState(null)

  const clickAction = (id, lat, lng) => {
    // clear distance to lines/markers
    for (let i = 0; i < polylines.length; i++) {
      leafletMap.removeLayer(polylines[i]); 
    }     
    for (let i = 0; i < markers.length; i++) {
      leafletMap.removeLayer(markers[i]); 
    }     

    markerRefs[id].openPopup()
    leafletMap.flyTo(new L.LatLng(lat, lng), 13)
  }

  // pagination
  const itemsPerPage = 5;
  const [page, setPage] = React.useState(1);
  const [noOfPages, setNoOfPages] = React.useState(0)

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const [pageTwo, setPageTwo] = React.useState(1);
  const [noOfPagesTwo, setNoOfPagesTwo] = React.useState(0)

  const handlePageChangeTwo = (event, value) => {
    setPageTwo(value);
  };

  // search bar
  const [pokemonList, setPokemonList] = useState([])
  const [inputText, setInputText] = useState("");

  let inputHandler = (e) => {
    var lowerCase = e.target.value.toLowerCase();
    setInputText(lowerCase);
  };

  useEffect(() => {
    const results = pokemon.filter(pokemon =>
      pokemon.name.toLowerCase().includes(inputText)
    );
    setPokemonList(results);
    setNoOfPages(Math.ceil(results.length / itemsPerPage))
  }, [inputText])

  // search for uploadeded pokemon
  const [pokemonListTwo, setPokemonListTwo] = useState([])
  const [inputTextTwo, setInputTextTwo] = useState("");

  let inputHandlerTwo = (e) => {
    var lowerCase = e.target.value.toLowerCase();
    setInputTextTwo(lowerCase);
  };

  useEffect(() => {
    const results = uploadedPokemon.filter(pokemon =>
      pokemon.name.toLowerCase().includes(inputTextTwo)
    );
    setPokemonListTwo(results);
    setNoOfPagesTwo(Math.ceil(results.length / itemsPerPage))
  }, [inputTextTwo])

  // to ucla
  const handleToUCLA = (event, id, lat, lng) => {

    // clear distance to lines/markers
    for (let i = 0; i < polylines.length; i++) {
      leafletMap.removeLayer(polylines[i]); 
    }     
    for (let i = 0; i < markers.length; i++) {
      leafletMap.removeLayer(markers[i]); 
    }     
    console.log(lat, lng)
    var point_a = new L.LatLng(lat, lng);
    var point_b = new L.LatLng(34.07, -118.45);
    var point_list = [point_a, point_b];

    var polyline = new L.Polyline(point_list, {
        color: '#3fb1ee',
        weight: 3,
        opacity: 1,
        smoothFactor: 1
    });

    var new_marker = new L.marker([34.07, -118.45]);
    var from = markerRefs[id].getLatLng();
    var to = new_marker.getLatLng();
    var distance = from.distanceTo(to).toFixed(0)/1000

    new_marker.bindTooltip(`Distance to UCLA: ${distance} km`, {
        permanent: true,
        direction: 'center',
        className: "my-labels"
    });

    polyline.addTo(leafletMap);
    new_marker.addTo(leafletMap);
    leafletMap.flyTo(new L.LatLng(34.07, -118.45), 13)
    polylines.push(polyline)
    markers.push(new_marker)
  };

  const [tileLayerUrl, setTileLayerUrl] = useState("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")

  // base map
  const handleTileOne = () => {
    setTileLayerUrl("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
  }
  // topo map
  const handleTileTwo = () => {
    setTileLayerUrl("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png")
  }
  // satellite map
  const handleTileThree = () => {
    setTileLayerUrl("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}")
  }
  // terrain map
  const handleTileFour = () => {
    setTileLayerUrl("https://tiles.stadiamaps.com/tiles/stamen_terrain_background/{z}/{x}/{y}{r}.png")
  }
  // light map
  const handleTileFive = () => {
    setTileLayerUrl("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png")
  }
  // dark map
  const handleTileSix = () => {
    setTileLayerUrl("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png")
  }
  // simple map
  const handleTileSeven = () => {
    setTileLayerUrl("https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}")
    
  }
  const handleTileEight = () => {
    setTileLayerUrl("https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png")
  }
  const handleTileNine = () => {
    setTileLayerUrl("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
  }
  const handleTileTen = () => {
    setTileLayerUrl("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
  }

  const drawer = (
    <div>
      <List>
        <ListItem>
          <ListItemAvatar>
          <Avatar
            alt="logo"
            src="/pokemon_trainer.png"
          />
          </ListItemAvatar>
          <ListItemText primary={user} style={{ textAlign: 'left' }}/>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItemButton onClick = {handleLogout} size="small">
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
        <ListItemButton aria-describedby={popoverIdTwo} onClick={handlePopoverTwo}>
          <ListItemIcon>
            <MapIcon />
          </ListItemIcon>
          <ListItemText primary="Change Map Layer" />
        </ListItemButton>
        <Popover
        id={popoverIdTwo}
        open={popoverOpenTwo}
        anchorEl={anchorElTwo}
        onClose={handlePopoverCloseTwo}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        elevation={1}
        style={{ borderRadius: '10px' }}
        >
          <div style={{ padding: '0px' }}>
            <List style={{maxHeight: '295px', overflow: 'auto'}}>
              <ListItemButton onClick={handleTileOne} sx={{ minWidth: 180, height: '40px' }}>
                <ListItemText primary="Base Map" />
              </ListItemButton>
              <ListItemButton onClick={handleTileTwo} sx={{ minWidth: 180, height: '40px' }}>
                <ListItemText primary="Topographic Map" />
              </ListItemButton>
              <ListItemButton onClick={handleTileThree} sx={{ minWidth: 180, height: '40px' }}>
                <ListItemText primary="Satellite Map" />
              </ListItemButton>
              <ListItemButton onClick={handleTileFour} sx={{ minWidth: 180, height: '40px' }}>
                <ListItemText primary="Terrain Map" />
              </ListItemButton>
              <ListItemButton onClick={handleTileFive} sx={{ minWidth: 180, height: '40px' }}>
                <ListItemText primary="Light Map" />
              </ListItemButton>
              <ListItemButton onClick={handleTileSix} sx={{ minWidth: 180, height: '40px' }}>
                <ListItemText primary="Dark Map" />
              </ListItemButton>
              <ListItemButton onClick={handleTileSeven} sx={{ minWidth: 180, height: '40px' }}>
                <ListItemText primary="Ocean Map" />
              </ListItemButton>
              <ListItemButton onClick={handleTileEight} sx={{ minWidth: 180, height: '40px' }}>
                <ListItemText primary="Simple Map" />
              </ListItemButton>
            </List>
          </div>
        </Popover>
      </List>
      <Divider />
      <List>
        <ListItemButton aria-describedby={popoverId} onClick={handlePopover}>
          <ListItemIcon>
            <DriveFolderUploadIcon />
          </ListItemIcon>
          <ListItemText primary="Upload Pokémon" />
        </ListItemButton>
        <Popover
        id={popoverId}
        open={popoverOpen}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        elevation={1}
        style={{ borderRadius: '10px' }}
        >
          <div style={{ padding: '10px' }}>
            <Dropzone
              id="dropzone"
              onChange={updateFiles}
              value={files}
              accept={".csv"}
              maxFiles={1}
              actionButtons={{
                position: "after",
                abortButton: { style: { textTransform: "uppercase" } },
                uploadButton: { style: { textTransform: "uppercase" } },
                deleteButton: { style: { textTransform: "uppercase" } },
             }}
              behaviour={"replace"}
              header={false}
              uploadConfig={{
                  url: base_url+`/upload-pokemon/?username=${localStorage.getItem("user")}`,
                  method: "POST",
                  uploadLabel: "file"
              }}
              onUploadFinish={handleUploadFinish}
              label={'Drag & drop Pokémon file here, or click to upload.'}
              style={{ width: '290px', height: '250px', fontFamily: 'Roboto', fontWeight: '400', fontSize: '1rem', color: 'black',}}
            >
            {files.map((file) => (
                <FileMosaic key={file.id} {...file} onDelete={removeFile} info preview/>
              ))}
            </Dropzone>
          </div>
        </Popover>
      </List>
      <Divider />
      {/* Uploaded Pokemon */}
      <List>
        <Tooltip placement='right' title="These are Pokémon that you've uploaded. To add more, please upload a .csv file containing Pokémon stats." arrow slotProps={{
          popper: {
            modifiers: [
                  {
                    name: 'offset',
                    options: {
                      offset: [0, 0],
                    },
                  },
                ],
              },
            }}>
        <ListItemButton onClick={handleDropdownOne}>
          <ListItemIcon>
            <FolderOpenIcon />
          </ListItemIcon>
          <ListItemText primary="My Pokémon" />
          {openOne ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        </Tooltip>
        <Collapse in={openOne} timeout="auto" unmountOnExit>
           { uploadedPokemon.length > 0 ? <div style={{ paddingLeft: '16px', paddingRight: '20px', paddingBottom: '8px' }}>
            <TextField variant="standard" label="Search Pokémon" onChange={inputHandlerTwo} type="search" placeholder="Start typing..." autoComplete='off' size="small" sx={{
              width: '100%',
            }} 
            />
            
          </div> : <>
            <Typography sx={{ color: '#666666', textAlign: 'center', pt: '16px'}}>No uploaded Pokémon. Download example file <a style={{color: '#666666', fontSize: '15px'}} href='/pokemon_upload.csv' download>here</a>.</Typography>
            {/* <Typography sx={{ color: '#666666', textAlign: 'center', pt: '16px', paddingTop: '0px' }}><a style={{color: '#666666', fontSize: '15px'}} href='/somefile.txt' download>Download example file</a></Typography>  */}
          </> }
          <List component="div" disablePadding>
            { dataLoadedTwo ? pokemonListTwo.map(p => (
            <ListItem key={p.identifier} secondaryAction={
              <>
              <Rating
                name="simple-controlled"
                value={p.favorited || ratingRefs[p.identifier] ? 1 : 0}
                onChange={(event) => handleRatingChangeTwo(event, p.identifier)}
                max={1}
              />
              </>}
              disablePadding
            >
            <ListItemButton key={p.identifier} sx={{ pl: '16px'}} onClick={() => {
                clickAction(p.identifier, p.latitude, p.longitude);
              }}>
              <ListItemAvatar sx={{ ml: '4px', mr: '20px', minWidth: '32px'}}>
                <Avatar
                  alt="logo"
                  src={p.sprite_url}
                  variant="square"
                  sx={{ width: 32, height: 32 }}
                />
              </ListItemAvatar>
              <ListItemText primary={p.name ? (p.name.charAt(0).toUpperCase() + p.name.slice(1)) : 'Undefined'} secondary={ '(' + parseFloat(p.latitude).toFixed(2) + ', ' + parseFloat(p.longitude).toFixed(2) + ')' }/> {/*secondary={parseFloat(p.latitude).toFixed(2) + ', ' + parseFloat(p.longitude).toFixed(2)}*/}
            </ListItemButton>
            </ListItem>
            )) : <></> }
          </List>
          { dataLoadedTwo && uploadedPokemon.length > itemsPerPage ? <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '10px', paddingBottom: '5px', paddingRight: '2px'}}>
            <Pagination
              sx={{
                '& > .MuiPagination-ul': {
                  justifyContent: 'center',
                },
              }}
              count={noOfPagesTwo}
              page={pageTwo}
              onChange={handlePageChangeTwo}
              defaultPage={1}
              shape="rounded" 
            />
          </Box> : <></> }
        </Collapse>
      </List>
      {/* Stored Pokemon */}
      <List>
        <Tooltip placement='right' title="These Pokémon were randomly generated for you. There's 100 of them!" arrow slotProps={{
        popper: {
          modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: [0, 0],
                  },
                },
              ],
            },
          }}>
          <ListItemButton onClick={handleDropdownTwo}>
            <ListItemIcon>
              <CatchingPokemonIcon />
            </ListItemIcon>
            <ListItemText primary="Storage" />
            {openTwo ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </Tooltip>
        <Collapse in={openTwo} timeout="auto" unmountOnExit>
        { pokemon.length > 0 ? <div style={{ paddingLeft: '16px', paddingRight: '20px', paddingBottom: '8px' }}>
            <TextField variant="standard" onChange={inputHandler} label="Search Pokémon" type="search" placeholder="Start typing..." autoComplete='off' size="small" sx={{
              width: '100%',
            }} 
            />
          </div> : <Typography sx={{ color: '#666666', textAlign: 'center', pt: '16px'}}>No stored pokemon.</Typography> }
          <List component="div" disablePadding>
            { dataLoaded ? pokemonList.slice((page - 1) * itemsPerPage, page * itemsPerPage).map(p => (
            <ListItem key={p.identifier} secondaryAction={
              // <>
              // <IconButton 
              //   onClick={(event) => handleRatingChange(event, p.identifier)}>
              //   <StarBorderIcon/>
              // </IconButton> 
              // </>}
              <>
              <Rating key={p.identifier}
                name="simple-controlled"
                value={p.favorited || ratingRefs[p.identifier] ? 1 : 0}
                onClick={(event) => handleRatingChange(event, p.identifier)}
                max={1}
              />
              </>}
              disablePadding
              
            >
            <ListItemButton key={p.identifier} sx={{ pl: '16px'}} onClick={() => {
                clickAction(p.identifier, p.latitude, p.longitude);
              }}>
              <ListItemAvatar sx={{ ml: '4px', mr: '20px', minWidth: '32px'}}>
                <Avatar
                  alt="logo"
                  src={p.stats.sprites.other["official-artwork"].front_default}
                  variant="square"
                  sx={{ width: 32, height: 32 }}
                />
              </ListItemAvatar>
              <ListItemText primary={p.name ? (p.name.charAt(0).toUpperCase() + p.name.slice(1)) : 'Undefined'} secondary={ '(' + parseFloat(p.latitude).toFixed(2) + ', ' + parseFloat(p.longitude).toFixed(2) + ')' }/> {/*secondary={parseFloat(p.latitude).toFixed(2) + ', ' + parseFloat(p.longitude).toFixed(2)}*/}
            </ListItemButton>
            </ListItem>
            )) : <></> }
          </List>
          { dataLoaded && pokemon.length > itemsPerPage ? <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '10px', paddingBottom: '5px', paddingRight: '2px'}}>
            <Pagination
              sx={{
                '& > .MuiPagination-ul': {
                  justifyContent: 'center',
                },
              }}
              count={noOfPages}
              page={page}
              onChange={handlePageChange}
              defaultPage={1}
              shape="rounded" 
            />
          </Box> : <></> }
        </Collapse>
      </List>
    </div>
  );
  
  // main app
  if (isAuthenticated) {
    return (
      <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      { width < 600 ? <AppBar
        position="fixed"
        elevation={1}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: "white",
        }}
      >
        <Toolbar>
          <IconButton
            color="black"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" color="black">
            Menu
          </Typography>
        </Toolbar>
      </AppBar> : <></> }
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, padding: '10px', width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        { width < 600 ? <Toolbar /> : <></> }
        <MapContainer center={[38.13, -120.99]} zoom={8} scrollWheelZoom={false} ref={setLeafletMap} style={{ height: `calc(100vh - 20px)`, borderRadius: '10px' }}>
          <TileLayer
            url={tileLayerUrl}
          />
          {/* uploaded pokemon */}
          { dataLoadedTwo ? uploadedPokemon.map(p => (
            <Marker key={p.identifier} position={[parseFloat(p.latitude), parseFloat(p.longitude)]} ref={ref => markerRefs[p.identifier] = ref} icon={L.icon({
              iconUrl: p.sprite_url,
              iconSize: [64, 64],
            })}>
              <Popup key={p.identifier} >
                <Box sx={{ flexGrow: 1, width: '300px', height: '300px', padding: '10px' }}>
                  <Grid container spacing={1}>
                    <Grid item xs={6} sx={{ height: '150px' }}>
                      <Box><img 
                        src={p.sprite_url}
                        alt="new"
                        style={{ width: '100%', height: 'auto' }}
                      /></Box>
                    </Grid>
                    <Grid item xs={6} sx={{ padding: 0 }}>
                      <Box>
                        <Typography style={{margin: '0px'}} fontWeight='normal'>{p.name ? (p.name.charAt(0).toUpperCase() + p.name.slice(1)) : 'Undefined'}</Typography>
                        <Stack direction="row" spacing={1} sx={{ pt: '5px'}}>
                            <Chip label={p.type ? (p.type.charAt(0).toUpperCase() + p.type.slice(1)) : 'Undefined'} size="small" variant="outlined" 
                            style={{ 
                            borderColor: p.type.toLowerCase() == "normal" ? '#A8A77A' : 
                            p.type.toLowerCase() == "fire" ? '#EE8130' : 
                            p.type.toLowerCase() == "water" ? '#6390F0' :
                            p.type.toLowerCase() == "electric" ? '#F7D02C' :
                            p.type.toLowerCase() == "grass" ? '#7AC74C' :
                            p.type.toLowerCase() == "ice" ? '#96D9D6' :
                            p.type.toLowerCase() == "fighting" ? '#C22E28' :
                            p.type.toLowerCase() == "poison" ? '#A33EA1' :
                            p.type.toLowerCase() == "ground" ? '#E2BF65' :
                            p.type.toLowerCase() == "flying" ? '#A98FF3' :
                            p.type.toLowerCase() == "psychic" ? '#F95587' :
                            p.type.toLowerCase() == "bug" ? '#A6B91A' :
                            p.type.toLowerCase() == "rock" ? '#B6A136' :
                            p.type.toLowerCase() == "ghost" ? '#735797' :
                            p.type.toLowerCase() == "dragon" ? '#6F35FC' :
                            p.type.toLowerCase() == "dark" ? '#705746' :
                            p.type.toLowerCase() == "steel" ? '#B7B7CE' :
                            p.type.toLowerCase() == "fairy" ? '#D685AD' : 'black',
                            color: p.type.toLowerCase() == "normal" ? '#A8A77A' : 
                            p.type.toLowerCase() == "fire" ? '#EE8130' : 
                            p.type.toLowerCase() == "water" ? '#6390F0' :
                            p.type.toLowerCase() == "electric" ? '#F7D02C' :
                            p.type.toLowerCase() == "grass" ? '#7AC74C' :
                            p.type.toLowerCase() == "ice" ? '#96D9D6' :
                            p.type.toLowerCase() == "fighting" ? '#C22E28' :
                            p.type.toLowerCase() == "poison" ? '#A33EA1' :
                            p.type.toLowerCase() == "ground" ? '#E2BF65' :
                            p.type.toLowerCase() == "flying" ? '#A98FF3' :
                            p.type.toLowerCase() == "psychic" ? '#F95587' :
                            p.type.toLowerCase() == "bug" ? '#A6B91A' :
                            p.type.toLowerCase() == "rock" ? '#B6A136' :
                            p.type.toLowerCase() == "ghost" ? '#735797' :
                            p.type.toLowerCase() == "dragon" ? '#6F35FC' :
                            p.type.toLowerCase() == "dark" ? '#705746' :
                            p.type.toLowerCase() == "steel" ? '#B7B7CE' :
                            p.type.toLowerCase() == "fairy" ? '#D685AD' : 'black',
                            }}
                            />
                        </Stack>
                        <Typography style={{ margin: '0px', textAlign: 'left' }} sx={{ color: '#666666', fontSize: '10px', paddingTop: '10px', paddingRight: '10px' }}>at ({parseFloat(p.latitude).toFixed(2)}, {parseFloat(p.longitude).toFixed(2)}) </Typography> {/*<FolderOpenIcon style={{marginBottom: '1px', marginLeft: '1px', verticalAlign: 'middle'}} fontSize="20px" />*/}
                        <Box sx={{paddingTop:'30px', display: 'flex', justifyContent: 'right', paddingRight: '10px'}}>
                          <Button
                            style={{}}
                            variant="outlined"
                            color="info"
                            size="small"
                            startIcon={<NorthWestIcon />}
                            onClick={(event) => handleToUCLA(event, p.identifier, p.latitude, p.longitude)}
                          >
                            TO UCLA
                          </Button>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ pl: '10px', pr: '10px'}}>
                        <Divider/>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ paddingLeft: '10px', height: '60px'}}>
                        <Typography style={{ margin: '0px', fontSize: '12px', fontWeight: 'bold' }}>Last four moves: </Typography>
                        <Typography style={{ margin: '0px', fontSize: '12px' }}>{p.moves[0] ? (p.moves[0].charAt(0).toUpperCase() + p.moves[0].slice(1)) : 'Undefined'}, {p.moves[1] ? (p.moves[1].charAt(0).toUpperCase() + p.moves[1].slice(1)) : 'Undefined'}, {p.moves[2] ? (p.moves[2].charAt(0).toUpperCase() + p.moves[2].slice(1)) : 'Undefined'}, {p.moves[3] ? (p.moves[3].charAt(0).toUpperCase() + p.moves[3].slice(1)) : 'Undefined'}</Typography>  
                      </Box>
                    </Grid>
                    <Grid item xs={8}>
                      <Box sx={{ paddingLeft: '10px'}}>
                        <Typography style={{ margin: '0px', fontSize: '12px', fontWeight: 'bold' }}>Encountered at: </Typography>
                        <Typography style={{ margin: '0px', fontSize: '12px' }}>{p.location ? (p.location.charAt(0).toUpperCase() + p.location.slice(1)) : 'Undefined' }</Typography>  
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box sx={{ paddingLeft: '15px', paddingTop: '15px'}}>
                        <Button
                          style={{maxWidth: '20px'}}
                          variant="outlined"
                          color="error"
                          size="small"
                          //startIcon={<DeleteIcon />}
                          onClick={(event) => handleDeleteTwo(event, p.identifier)}
                        >
                          Delete
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Popup>
            </Marker>
          )) : <></>}
          {/* stored pokemon */}
          { dataLoaded ? pokemon.map(p => (
            <Marker key={p.identifier} position={[parseFloat(p.latitude), parseFloat(p.longitude)]} ref={ref => markerRefs[p.identifier] = ref} icon={L.icon({
              iconUrl: p.stats.sprites.other["official-artwork"].front_default,
              iconSize: [64, 64],
            })}>
              <Popup key={p.identifier} >
                <Box sx={{ flexGrow: 1, width: '300px', height: '300px', padding: '10px' }}>
                  <Grid container spacing={1}>
                    <Grid item xs={6} sx={{ height: '150px' }}>
                      <Box><img 
                        src={p.stats.sprites.other["official-artwork"].front_default}
                        alt="new"
                        style={{ width: '100%', height: 'auto' }}
                      /></Box>
                    </Grid>
                    <Grid item xs={6} sx={{ padding: 0 }}>
                      <Box>
                        <Typography style={{margin: '0px'}} fontWeight='normal'>{p.name ? (p.name.charAt(0).toUpperCase() + p.name.slice(1)) : 'Undefined'}</Typography>
                        <Stack direction="row" spacing={1} sx={{ pt: '5px'}}>
                          { p.stats.types.map(t => (
                            <Chip label={t.type.name ? (t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1)) : 'Undefined'} size="small" variant="outlined" 
                            style={{ 
                            borderColor: t.type.name == "normal" ? '#A8A77A' : 
                            t.type.name == "fire" ? '#EE8130' : 
                            t.type.name == "water" ? '#6390F0' :
                            t.type.name == "electric" ? '#F7D02C' :
                            t.type.name == "grass" ? '#7AC74C' :
                            t.type.name == "ice" ? '#96D9D6' :
                            t.type.name == "fighting" ? '#C22E28' :
                            t.type.name == "poison" ? '#A33EA1' :
                            t.type.name == "ground" ? '#E2BF65' :
                            t.type.name == "flying" ? '#A98FF3' :
                            t.type.name == "psychic" ? '#F95587' :
                            t.type.name == "bug" ? '#A6B91A' :
                            t.type.name == "rock" ? '#B6A136' :
                            t.type.name == "ghost" ? '#735797' :
                            t.type.name == "dragon" ? '#6F35FC' :
                            t.type.name == "dark" ? '#705746' :
                            t.type.name == "steel" ? '#B7B7CE' :
                            t.type.name == "fairy" ? '#D685AD' : 'black',
                            color: t.type.name == "normal" ? '#A8A77A' : 
                            t.type.name == "fire" ? '#EE8130' : 
                            t.type.name == "water" ? '#6390F0' :
                            t.type.name == "electric" ? '#F7D02C' :
                            t.type.name == "grass" ? '#7AC74C' :
                            t.type.name == "ice" ? '#96D9D6' :
                            t.type.name == "fighting" ? '#C22E28' :
                            t.type.name == "poison" ? '#A33EA1' :
                            t.type.name == "ground" ? '#E2BF65' :
                            t.type.name == "flying" ? '#A98FF3' :
                            t.type.name == "psychic" ? '#F95587' :
                            t.type.name == "bug" ? '#A6B91A' :
                            t.type.name == "rock" ? '#B6A136' :
                            t.type.name == "ghost" ? '#735797' :
                            t.type.name == "dragon" ? '#6F35FC' :
                            t.type.name == "dark" ? '#705746' :
                            t.type.name == "steel" ? '#B7B7CE' :
                            t.type.name == "fairy" ? '#D685AD' : 'black'
                            }}
                            />
                          ))}
                        </Stack>
                        <Typography style={{ margin: '0px', textAlign: 'left' }} sx={{ color: '#666666', fontSize: '10px', paddingTop: '10px', paddingRight: '10px' }}>at ({parseFloat(p.latitude).toFixed(2)}, {parseFloat(p.longitude).toFixed(2)})</Typography>
                        <Box sx={{paddingTop:'30px', display: 'flex', justifyContent: 'right', paddingRight: '10px'}}>
                          <Button
                            style={{}}
                            variant="outlined"
                            color="info"
                            size="small"
                            startIcon={<NorthWestIcon />}
                            onClick={(event) => handleToUCLA(event, p.identifier, p.latitude, p.longitude)}
                          >
                            TO UCLA
                          </Button>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ pl: '10px', pr: '10px'}}>
                        <Divider/>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ paddingLeft: '10px', height: '60px'}}>
                        <Typography style={{ margin: '0px', fontSize: '12px', fontWeight: 'bold' }}>Last four moves: </Typography>
                        <Typography style={{ margin: '0px', fontSize: '12px' }}>{p.moves[0] ? (p.moves[0].charAt(0).toUpperCase() + p.moves[0].slice(1)) : 'Undefined'}, {p.moves[1] ? (p.moves[1].charAt(0).toUpperCase() + p.moves[1].slice(1)) : 'Undefined'}, {p.moves[2] ? (p.moves[2].charAt(0).toUpperCase() + p.moves[2].slice(1)) : 'Undefined'}, {p.moves[3] ? (p.moves[3].charAt(0).toUpperCase() + p.moves[3].slice(1)) : 'Undefined'}</Typography>  
                      </Box>
                    </Grid>
                    <Grid item xs={8}>
                      <Box sx={{ paddingLeft: '10px'}}>
                        <Typography style={{ margin: '0px', fontSize: '12px', fontWeight: 'bold' }}>Encountered at: </Typography>
                        <Typography style={{ margin: '0px', fontSize: '12px' }}>{p.location ? (p.location.charAt(0).toUpperCase() + p.location.slice(1)) : 'Undefined' }</Typography>  
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box sx={{ paddingLeft: '15px', paddingTop: '15px'}}>
                        <Button
                          style={{maxWidth: '20px'}}
                          variant="outlined"
                          color="error"
                          size="small"
                          //startIcon={<DeleteIcon />}
                          onClick={(event) => handleDelete(event, p.identifier)}
                        >
                          Delete
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Popup>
            </Marker>
          )) : <></>}
        </MapContainer>
      </Box>
    </Box>
    );
  }

  // landing page
  else {
    return (
      <div className="App" style={{ 
        backgroundImage: `url(${background})`,
        //backgroundPosition: 'center',
        backgroundSize: 'cover',  
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        width: '100vw'
      }}>
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          sx={{ minHeight: '100vh' }}
          >
          <Grid item>
          <Box component="section" sx={{
              padding: '10px',
              paddingBottom: '10px',
              paddingTop: '30px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: '#FFFFFF',
              borderRadius: '10px'
            }}>
      
            <Box component="section" sx={{
              paddingTop: 0,
              marginRight: '15px'
            }}>
              <img src="/pokemon-logo.png" alt="logo" width="250"/>
            </Box>
            <Box component="section" sx={{
              paddingTop: 0,
              width: '100%',

            }}>
              <Typography sx={{ color: 'black', fontWeight: '400', letterSpacing: 3, fontSize: "40px", display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', marginLeft: '5px'}}>FiNDER</Typography>
              {/* <Divider sx={{ marginBottom: '15px'}} /> */}
              
            </Box>

            <Grid container spacing={4} alignItems="center" justifyContent="center">
                <Grid item>
                  <Button
                  component={Link}
                  to="/login"
                  variant="contained"
                  sx={{ mt: 4, mb: 0 }}
                  //startIcon={<LoginIcon />}
                  >
                    Login
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  sx={{ mt: 4, mb: 0 }}
                  //startIcon={<PersonAddIcon />}
                  >
                    Register
                  </Button>
                </Grid>
                <Grid item>
                  <Box sx={{ width: '350px', }}>
                    <Divider/>
                    <Typography sx={{ display: 'flex', color: '#666666', justifyContent: 'center', alignItems: 'center', textAlign: 'center', marginBottom: '15px', paddingTop: '20px'}}>A Pokémon map app. (by Ethan Bresk)</Typography>
                  </Box>
                </Grid>
              </Grid>
              
            </Box>
            </Grid>
          </Grid>
        </Container>
      </ThemeProvider> 
      </div>
    );
  }
}