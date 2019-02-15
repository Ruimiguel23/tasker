<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
Route::post('/user/login','Api\UserController@login');
Route::post('/user/register','Api\UserController@register');
Route::middleware('auth:api')->group(function(){
    Route::delete('project/{project}/delete_tasks','Api\ProjectController@deleteTasks');
    Route::post('project/{user}','Api\ProjectController@store');
    Route::get('project/{project}/task/new_id','Api\TaskController@getNewId');
    Route::get('user/{user}/projects',"Api\UserController@getProjects");
    Route::get('project/{project}/tasks',"Api\ProjectController@getTasks");
    Route::get('project/{project}/completed','Api\ProjectController@getCompleted');
    Route::post('task/complete','Api\TaskController@complete');
    Route::post('task/incomplete','Api\TaskController@incomplete');
    Route::resource("/project","Api\ProjectController");
    Route::resource("/task","Api\TaskController");
});


