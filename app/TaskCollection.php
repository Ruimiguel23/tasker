<?php


namespace App;

use Illuminate\Database\Eloquent\Collection;

class TaskCollection extends Collection
{
    public function subTasks(){
        $tasks = parent::groupBy('parent_id');
        if(count($tasks)){
            $tasks['root'] = $tasks[''];
            unset($tasks['']);

        }
        return $tasks;
    }

}
