import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import DogCard from "./card/dogCard.jsx";
import EmptyCard from "./card/emptyCard.jsx";
import { useAuth } from '../contexts/AuthContext.jsx';

import { Button, Grid, Paper, TextField, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";

const HomePage = () => {
  const [list, setList] = useState([]);
  const { zipSearch } = useAuth();
  const [ zipSearchData, setZipSearchData ] = zipSearch;
  const [ searchField, setSearchField ] = useState('');

  const config = {
    params: {
      limit: 5,
    },
  };

  useEffect(() => {
    axios
      .get("/adopt", config)
      .then(({ data }) => setList(data))
      .then(() => console.log("Top 5 adoptions loaded successfully"))
      .catch((e) => console.log(e));
  }, []);

  const beginSearch = () => {
    setZipSearchData(searchField)
  }

  const searchBar = () => {
    const homeSearch = {
      marginTop: "20px",
    };

    const dogButton = {
      height: "56px",
      width: "164px",
    };

    return (
      <Grid container justifyContent="center" spacing={1} sx={homeSearch}>
        <Grid item xs="auto">
          <TextField
            label="Enter your Zip Code"
            variant="outlined"
            fullWidth
            onChange={(e) => {
              setSearchField(e.target.value)
            }}
            sx={{ minWidth: "164px" }}
          />
        </Grid>
        <Grid item xs="auto">
          <Link to='/search'>
          <Button
            variant="contained"
            size="large"
            endIcon={<SearchIcon />}
            sx={dogButton}
            onClick={beginSearch}
          >
            Find a Dog
          </Button>
          </Link>
        </Grid>
      </Grid>
    );
  };

  const listTop5 = () => {
    let top5 = [];

    if (!list?.length) {
      for (var i = 0; i < 5; i++) {
        top5.push(<EmptyCard key={i} />);
      }
    } else {
      top5 = list.map((pet) => {
        const photo = pet.photos[0];
        return (
          <Grid item key={pet.id}>
            <DogCard
              image={photo?.medium ? photo.medium : undefined}
              text={`${pet.age} ${pet.breeds.primary}`}
              type="heart"
              name={pet.name}
              dogObj={pet}
            />
          </Grid>
        );
      });
    }

    return (
      <Grid container justifyContent="center" spacing={3}>
        {top5}
      </Grid>
    );
  };

  const researchBreeds = () => {
    const image =
      "https://i0.wp.com/images.ctfassets.net/440y9b545yd9/4xeV5wnpElbhV0aG2wTiQy/c8d921df3e81977dcdc5a03706502bc4/dog_pack_top10_850__1_.jpg";

    const style = {
      overlay: {
        width: "95%",
        maxWidth: "850px",
        height: "280px",
        borderRadius: "10px",
        border: "1px solid black",
        backgroundImage: `linear-gradient(rgba(193,193,193,1),rgba(193,193,193,1)), url(${image})`,
        backgroundBlendMode: "screen",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        margin: "auto",
        marginTop: "10px",
        marginBottom: "20px",
      },

      title: {
        fontWeight: "bold",
        margin: 0,
      },

      button: {
        margin: 0,
        width: "200px",
      },
    };

    return (
      <Grid container justifyContent="center">
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          sx={style.overlay}
          spacing={5}
        >
          <Grid item xs="auto">
            <Typography variant="h6" sx={style.title}>
              Don't know what you want yet? Research breeds here!
            </Typography>
          </Grid>
          <Grid item xs="auto">
            <Link to="/research">
              <Button variant="contained" sx={style.button}>
                Get Started
              </Button>
            </Link>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  return (
    <>
      <Grid container direction="column" spacing={3}>
        <Grid item xs={12}>
          {searchBar()}
        </Grid>
        <Grid item xs={12}>
          <Typography align="center" variant="h4">
            Top five dogs for adoption
          </Typography>
        </Grid>
        <Grid item xs={12}>
          {listTop5()}
        </Grid>
        <Grid item xs={12}>
          {researchBreeds()}
        </Grid>
      </Grid>
    </>
  );
};

export default HomePage;
