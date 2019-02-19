<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable=['description','completed','project_id','created_by_id','edited_by_id','completed_by_id','parent_id'];

    public function owner(){
        return $this->belongsTo(User::class,'created_by_id');
    }

    public function project(){
        return $this->belongsTo(Project::class,'project_id');
    }

}
