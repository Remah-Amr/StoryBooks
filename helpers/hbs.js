const moment = require('moment');


module.exports = {
  truncate: function(str, len){ // pass string and length i wand to maximize with it
    if (str.length > len && str.length > 0) {
			var new_str = str + " ";
			new_str = str.substr(0, len);
			new_str = str.substr(0, new_str.lastIndexOf(" "));
			new_str = (new_str.length > 0) ? new_str : str.substr(0, len);
			return new_str + '...';
		}
		return str; // if string no longer than len , will return original str
  },
  // remove any html tags like <p> , if i write at index.handlebars {{{body}}}  instead of {{body}} problem solved , but this way to help with coding
  stripTags: function(input){
    return input.replace(/<(?:.|\n)*?>/gm, '');
  },
  formatDate: function(date, format){
    return moment(date).format(format);
  },
  select: function(selected, options){
    return options.fn(this).replace( new RegExp(' value=\"' + selected + '\"'), '$& selected="selected"').replace( new RegExp('>' + selected + '</option>'), ' selected="selected"$&');
  },
  // listen record in messanger about editIcon
  editIcon: function(storyUser, loggedUser, storyId, floating = true){
    if(storyUser == loggedUser){
      if(floating){
        return `<a href="/stories/edit/${storyId}" class="btn-floating halfway-fab red"><i class="fa fa-pencil"></i></a>`;
      } else {
        return `<a href="/stories/edit/${storyId}"><i class="fa fa-pencil"></i></a>`;
      }
    } else {
      return '';
    }
  }
}
