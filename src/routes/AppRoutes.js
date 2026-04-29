import { ListTypes } from '../utils/Enums';
import { NAVIGATION } from '../utils/Constants';
import { Route, Routes } from 'react-router-dom';
import About from '../components/Site/About';
import AddMovement from '../components/Exercises/AddMovement';
import ArchivedTaskListDetails from '../components/TaskListsArchive/ArchivedTaskListDetails';
import BandDetails from '../components/Music/BandDetails';
import BmiCalculator from '../components/BmiCalculator/BmiCalculator';
import BoardGameDetails from '../components/Games/BoardGameDetails';
import Car from '../components/Car/Car';
import CreateExercise from '../components/Exercises/CreateExercise';
import CreateTrack from '../components/DiscGolf/CreateTrack';
import Dashboard from '../components/Dashboard/Dashboard';
import Demo from '../components/Demo/Demo';
import DrinkDetails from '../components/Drinks/DrinkDetails';
import DrinkingProductDetails from '../components/Drinks/DrinkingProductDetails';
import EventDetails from '../components/Music/EventDetails';
import ExerciseDetails from '../components/Exercises/ExerciseDetails';
import FoodItemDetails from '../components/Recipe/FoodItemDetails';
import ForgotPassword from '../components/Auth/ForgotPassword';
import GameDetails from '../components/Games/GameDetails';
import Games from '../components/Games/Games';
import GearDetails from '../components/BackPacking/GearDetails';
import LinksList from '../components/Links/LinksList';
import Login from '../components/Auth/Login';
import ManageBackPacking from '../components/BackPacking/ManageBackPacking';
import ManageBoardGames from '../components/Games/ManageBoardGames';
import ManageDiscGolf from '../components/DiscGolf/ManageDiscGolf';
import ManageDiscGolfTracks from '../components/DiscGolf/ManageDiscGolfTracks';
import ManageDrinkingProducts from '../components/Drinks/ManageDrinkingProducts';
import ManageDrinks from '../components/Drinks/ManageDrinks';
import ManageExercises from '../components/Exercises/ManageExercises';
import ManageFoodItems from '../components/Recipe/ManageFoodItems';
import ManageGames from '../components/Games/ManageGames';
import ManageGear from '../components/BackPacking/ManageGear';
import ManageGearMaintenance from '../components/BackPacking/ManageGearMaintenance';
import ManageMovements from '../components/Exercises/ManageMovements';
import ManageMovies from '../components/Movies/ManageMovies';
import ManageMusicBands from '../components/Music/ManageMusicBands';
import ManageMusicEvents from '../components/Music/ManageMusicEvents';
import ManageMusicKaraokeSongs from '../components/Music/ManageKaraokeSongs';
import ManageMusicRecords from '../components/Music/ManageMusicRecords';
import ManageMyProfile from '../components/MyProfile/ManageMyProfile';
import ManagePeople from '../components/People/ManagePeople';
import ManageRecipes from '../components/Recipe/ManageRecipes';
import ManageTaskLists from '../components/TaskList/ManageTaskLists';
import ManageTaskListsArchive from '../components/TaskListsArchive/ManageTaskListsArchive';
import MovementDetails from '../components/Exercises/MovementDetails';
import MovieDetails from '../components/Movies/MovieDetails';
import PersonDetails from '../components/People/PersonDetails';
import PlayRound from '../components/DiscGolf/PlayRound';
import PrivateRoute from '../components/PrivateRoute';
import React from 'react';
import RecipeDetails from '../components/Recipe/RecipeDetails';
import RecordDetails from '../components/Music/RecordDetails';
import Signup from '../components/Auth/Signup';
import StartNewRound from '../components/DiscGolf/StartNewRound';
import TaskDetails from '../components/Task/TaskDetails';
import TaskListDetails from '../components/TaskList/TaskListDetails';
import TrackDetails from '../components/DiscGolf/TrackDetails';
import WeightHistory from '../components/BmiCalculator/WeightHistory';

const AppRoutes = () => (
  <Routes>
    <Route exact path='/' element={<PrivateRoute><Dashboard /></PrivateRoute>} />
    <Route path={NAVIGATION.ABOUT} element={<About />} />
    {/* Login */}
    <Route path={NAVIGATION.SIGNUP} element={<Signup />} />
    <Route path={NAVIGATION.LOGIN} element={<Login />} />
    <Route path={NAVIGATION.FORGOT_PASSWORD} element={<ForgotPassword />} />
    {/* Login */}
    {/* Recipe */}
    <Route path={NAVIGATION.FOODITEM_DETAILS + '/:id'} element={<PrivateRoute><FoodItemDetails /></PrivateRoute>} />
    <Route path={NAVIGATION.MANAGE_RECIPES} element={<PrivateRoute><ManageRecipes /></PrivateRoute>} />
    <Route path={NAVIGATION.MANAGE_FOODITEMS} element={<PrivateRoute><ManageFoodItems /></PrivateRoute>} />
    <Route path={NAVIGATION.MANAGE_RECIPELISTS} element={<PrivateRoute><ManageTaskLists listType={ListTypes.Food} /></PrivateRoute>} />
    <Route path={NAVIGATION.RECIPE + '/:id'} element={<PrivateRoute><RecipeDetails /></PrivateRoute>} />
    {/* Recipe */}
    {/* Drinks */}
    <Route path={NAVIGATION.MANAGE_DRINKS} element={<PrivateRoute><ManageDrinks /></PrivateRoute>} />
    <Route path={NAVIGATION.MANAGE_DRINKINPRODUCTS} element={<PrivateRoute><ManageDrinkingProducts /></PrivateRoute>} />
    <Route path={NAVIGATION.MANAGE_DRINKLISTS} element={<PrivateRoute><ManageTaskLists listType={ListTypes.Drinks} /></PrivateRoute>} />
    <Route path={NAVIGATION.DRINK + '/:id'} element={<PrivateRoute><DrinkDetails /></PrivateRoute>} />
    <Route path={NAVIGATION.DRINKINGPRODUCT + '/:id'} element={<PrivateRoute><DrinkingProductDetails /></PrivateRoute>} />
    {/*Drinks */}
    {/* Exercises */}
    <Route path={NAVIGATION.MANAGE_EXERCISES} element={<PrivateRoute><ManageExercises /></PrivateRoute>} />
    <Route path={NAVIGATION.CREATE_EXERCISE} element={<PrivateRoute><CreateExercise /></PrivateRoute>} />
    <Route path={NAVIGATION.MANAGE_MOVEMENTS} element={<PrivateRoute><ManageMovements /></PrivateRoute>} />
    <Route path={NAVIGATION.ADD_MOVEMENT} element={<PrivateRoute><AddMovement /></PrivateRoute>} />
    <Route path={NAVIGATION.EXERCISE + '/:id'} element={<PrivateRoute><ExerciseDetails /></PrivateRoute>} />
    <Route path={NAVIGATION.MOVEMENT + '/:id'} element={<PrivateRoute><MovementDetails /></PrivateRoute>} />
    <Route path={NAVIGATION.MANAGE_EXERCISE_LISTS} element={<PrivateRoute><ManageTaskLists listType={ListTypes.Exercises} /></PrivateRoute>} />
    {/* Exercises */}
    {/* BMI */}
    <Route path={NAVIGATION.BMICALCULATOR} element={<PrivateRoute><BmiCalculator /></PrivateRoute>} />
    <Route path={NAVIGATION.WEIGHTHISTORY} element={<PrivateRoute><WeightHistory /></PrivateRoute>} />
    {/* BMI */}
    {/* TaskLists */}
    <Route path={NAVIGATION.MANAGE_TASKLISTS} element={<PrivateRoute><ManageTaskLists /></PrivateRoute>} />
    <Route path={NAVIGATION.TASKLIST_ARCHIVE} element={<PrivateRoute><ManageTaskListsArchive /></PrivateRoute>} />
    <Route path='/task/:id/:tasklistid' element={<PrivateRoute><TaskDetails /></PrivateRoute>} />
    <Route path={NAVIGATION.TASKLIST + '/:id'} element={<PrivateRoute><TaskListDetails /></PrivateRoute>} />
    <Route path={NAVIGATION.TASKLIST_ARCHIVE + '/:id'} element={<PrivateRoute><ArchivedTaskListDetails /></PrivateRoute>} />
    {/* TaskLists */}
    {/* MyProfile */}
    <Route path={NAVIGATION.MANAGE_MY_PROFILE} element={<PrivateRoute><ManageMyProfile /></PrivateRoute>} />
    {/* MyProfile */}
    {/* Backpacking */}
    <Route path={NAVIGATION.MANAGE_BACKPACKING} element={<PrivateRoute><ManageBackPacking /></PrivateRoute>} />
    <Route path={NAVIGATION.MANAGE_BACKPACKINGLISTS} element={<PrivateRoute><ManageTaskLists listType={ListTypes.BackPacking} /></PrivateRoute>} />
    <Route path={NAVIGATION.MANAGE_GEAR} element={<PrivateRoute><ManageGear /></PrivateRoute>} />
    <Route path={NAVIGATION.MANAGE_GEAR_MAINTENANCE} element={<PrivateRoute><ManageGearMaintenance /></PrivateRoute>} />
    <Route path={NAVIGATION.GEAR + '/:id'} element={<PrivateRoute><GearDetails /></PrivateRoute>} />
    {/* Backpacking */}
    {/* Car */}
    <Route path={NAVIGATION.MANAGE_CARLISTS} element={<PrivateRoute><ManageTaskLists listType={ListTypes.Car} /></PrivateRoute>} />
    <Route path={NAVIGATION.CAR} element={<PrivateRoute><Car /></PrivateRoute>} />
    {/* Car */}
    {/* Music */}
    <Route path={NAVIGATION.MANAGE_MUSIC_RECORDS} element={<PrivateRoute><ManageMusicRecords /></PrivateRoute>} />
    <Route path={NAVIGATION.MANAGE_MUSIC_BANDS} element={<PrivateRoute><ManageMusicBands /></PrivateRoute>} />
    <Route path={NAVIGATION.MANAGE_MUSIC_EVENTS} element={<PrivateRoute><ManageMusicEvents /></PrivateRoute>} />
    <Route path={NAVIGATION.MANAGE_MUSICLISTS} element={<PrivateRoute><ManageTaskLists listType={ListTypes.Music} /></PrivateRoute>} />
    <Route path={NAVIGATION.MANAGE_MUSIC_KARAOKE_SONGS} element={<PrivateRoute><ManageMusicKaraokeSongs /></PrivateRoute>} />
    <Route path={NAVIGATION.MUSIC_RECORD + '/:id'} element={<PrivateRoute><RecordDetails /></PrivateRoute>} />
    <Route path={NAVIGATION.MUSIC_EVENT + '/:id'} element={<PrivateRoute><EventDetails /></PrivateRoute>} />
    <Route path={NAVIGATION.MUSIC_BAND + '/:id'} element={<PrivateRoute><BandDetails /></PrivateRoute>} />
    {/* Music */}
    {/* Games */}
    <Route path={NAVIGATION.GAMES} element={<PrivateRoute><Games /></PrivateRoute>} />
    <Route path={NAVIGATION.MANAGE_GAMES} element={<PrivateRoute><ManageGames /></PrivateRoute>} />
    <Route path={NAVIGATION.MANAGE_BOARD_GAMES} element={<PrivateRoute><ManageBoardGames /></PrivateRoute>} />
    <Route path={NAVIGATION.MANAGE_GAMELISTS} element={<PrivateRoute><ManageTaskLists listType={ListTypes.Games} /></PrivateRoute>} />
    <Route path={NAVIGATION.MANAGE_BOARD_GAMELISTS} element={<PrivateRoute><ManageTaskLists listType={ListTypes.BoardGames} /></PrivateRoute>} />
    <Route path={NAVIGATION.GAME + '/:id'} element={<PrivateRoute><GameDetails /></PrivateRoute>} />
    <Route path={NAVIGATION.BOARD_GAME + '/:id'} element={<PrivateRoute><BoardGameDetails /></PrivateRoute>} />
    {/* Games */}
    {/* Disc Golf */}
    <Route path={NAVIGATION.MANAGE_DISC_GOLF} element={<PrivateRoute><ManageDiscGolf /></PrivateRoute>} />
    <Route path={NAVIGATION.MANAGE_DISC_GOLF_TRACKS} element={<PrivateRoute><ManageDiscGolfTracks /></PrivateRoute>} />
    <Route path={NAVIGATION.DISC_GOLF_CREATE_TRACK} element={<PrivateRoute><CreateTrack /></PrivateRoute>} />
    <Route path={NAVIGATION.DISC_GOLF_START_NEW_ROUND} element={<PrivateRoute><StartNewRound /></PrivateRoute>} />
    <Route path={NAVIGATION.DISC_GOLF_PLAY_ROUND} element={<PrivateRoute><PlayRound /></PrivateRoute>} />
    <Route path={NAVIGATION.DISC_GOLF_TRACK + '/:id'} element={<PrivateRoute><TrackDetails /></PrivateRoute>} />
    {/* Disc Golf */}
    {/* Movies */}
    <Route path={NAVIGATION.MANAGE_MOVIES} element={<PrivateRoute><ManageMovies /></PrivateRoute>} />
    <Route path={NAVIGATION.MANAGE_MOVIELISTS} element={<PrivateRoute><ManageTaskLists listType={ListTypes.Movies} /></PrivateRoute>} />
    <Route path={NAVIGATION.MOVIE + '/:id'} element={<PrivateRoute><MovieDetails /></PrivateRoute>} />
    {/* Movies */}
    {/* Demo */}
    <Route path={NAVIGATION.DEMO} element={<PrivateRoute><Demo /></PrivateRoute>} />
    {/* Demo */}
    {/* Programming */}
    <Route path={NAVIGATION.MANAGE_PROGRAMMING} element={<PrivateRoute><ManageTaskLists listType={ListTypes.Programming} /></PrivateRoute>} />
    {/* Programming */}
    {/* Other lists */}
    <Route path={NAVIGATION.MANAGE_LISTS} element={<PrivateRoute><ManageTaskLists listType={ListTypes.Other} /></PrivateRoute>} />
    {/* Other lists */}
    {/* Links */}
    <Route path={NAVIGATION.LINKSLIST} element={<PrivateRoute><LinksList /></PrivateRoute>} />
    {/* Links */}
    {/* People / person */}
    <Route path={NAVIGATION.MANAGE_PEOPLE} element={<PrivateRoute><ManagePeople /></PrivateRoute>} />
    <Route path={NAVIGATION.PERSON + '/:id'} element={<PrivateRoute><PersonDetails /></PrivateRoute>} />
    {/* People  / person */}
    {
      <Route path={NAVIGATION.MANAGE_SHOPPINGLISTS} element={<PrivateRoute><ManageTaskLists listType={ListTypes.Shopping} /></PrivateRoute>} />
    }
  </Routes>
);

export default AppRoutes;
