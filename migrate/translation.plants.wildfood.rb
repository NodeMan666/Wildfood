

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
