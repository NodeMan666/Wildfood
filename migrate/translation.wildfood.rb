table "markers", :rename_to => 'Marker' do
	column "id", :key, :as => :integer
	column "plant_id", :integer, :rename_to => 'plant', :references => "Plant"
	column "location_lat", :float, :rename_to => 'location.position.latitude'
	column "location_lng", :float, :rename_to => 'location.position.longitude'
	column "location_name", :string, :rename_to => 'location.address.name'
	column "location_state", :string, :rename_to => 'location.address.state'
	column "location_country", :string, :rename_to => 'location.address.country'
	column "source", :string
	column "source_id", :string
	column "user_plant", :string
	column "title", :string
	column "description", :text
	column "tags", :text
	column "wf_user_id", :integer, :rename_to => 'owner', :references => "User"
	column "created_time", :timestamp, :rename_to => 'created'
	column "last_updated", :timestamp, :rename_to => 'updated'
	column "active", :integer, :rename_to => 'deleted', :as => 'boolean'
	column "verified", :integer, :as => 'boolean'
	column "public", :integer, :rename_to => 'private', :as => 'boolean'
end

table "comments", :embed_in => 'Marker', :on => 'marker_id' do
	column "id", :ignore => true
	column "marker_id", :ignore => true
	column "user_id", :string, :references => "User"
	column "comment", :text
	column "created_time", :datetime, :rename_to => 'created'
	column "last_updated", :ignore => true
end

#table "favourites" do
#	column "id", :key, :as => :integer
#	column "user_id", :integer, :references => "User"
#	column "marker_id", :integer, :references => "Marker"
#	column "plant_id", :integer, :references => "Plant"
#end

#table "images" do
#	column "id", :key, :as => :integer
#	column "parent_table", :string
#	column "parent_id", :integer, :references => "parents"
#	column "image_low_url", :string
#	column "image_low_width", :integer
#	column "image_low_height", :integer
#	column "image_thumb_url", :string
#	column "image_thumb_width", :integer
#	column "image_thumb_height", :integer
#	column "image_standard_url", :string
#	column "image_standard_width", :integer
#	column "image_standard_height", :integer
#	column "image_credit", :string
#	column "image_credit_link", :string
#end

#table "plant_alt_names" do
#	column "id", :key, :as => :integer
#	column "plant_id", :integer, :references => "Plant"
#	column "name", :string
#	column "last_updated", :timestamp
#end

#table "plant_marker_tags" do
#	column "id", :key, :as => :integer
#	column "plant_id", :integer, :references => "Plant"
#	column "primary_tag", :integer
#	column "tag", :string
#	column "last_updated", :timestamp
#end

table "plants", :rename_to => 'Plant' do
	column "id", :key, :as => :integer
	column "name", :string
	column "species", :string
	column "subspecies", :string
	column "family", :string
	column "weight", :string
	column "origin", :text
	column "habitat", :text
	column "description", :text
	column "physical_characteristics", :text
	column "distinguishing_features", :text
	column "notes", :text
	column "known_hazards", :text
	column "edibility_rating", :text
	column "edible_parts", :text
	column "warnings", :text
	column "medicinal_rating", :text
	column "medicinal_uses", :text
	column "medicinal_information", :text
	column "other_uses", :text
	column "other_information", :text
	column "image_credit", :string
	column "image_credit_link", :string
	column "ala_link", :string
	column "wiki_link", :string
	column "online_resources", :text
	column "created_by", :integer
	column "last_updated_by", :integer
	column "last_updated", :timestamp
end

#table "tag_synonyms" do
#	column "id", :key, :as => :integer
#	column "tag", :string
#	column "synonyms", :text
#end

#table "update_tracker" do
#	column "id", :key, :as => :integer
#	column "script", :string
#	column "outcome", :text
#	column "created", :timestamp
#end

table "user", :rename_to => 'User' do
	column "id", :key, :as => :integer
	column "source", :string, :ignore => true
	column "source_id", :string, :ignore => true
	column "username", :string, :rename_to => 'name'
	column "user_fullname", :string, :rename_to => 'fullname'
	column "user_profile_picture", :string, :rename_to => 'profile_picture'
	column "user_profile_link", :string, :rename_to => 'profile_link'
	column "details_checked", :integer, :ignore => true
	column "admin", :integer, :ignore => true
	column "active_user", :integer, :ignore => true
end

