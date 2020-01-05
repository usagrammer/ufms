class CreateBrandnameBrandgroups < ActiveRecord::Migration[5.2]
  def change
    create_table :brandname_brandgroups do |t|
      t.references :brand_name, forign_key: true, null: false
      t.references :brand_group, forign_key: true, null: false
      t.timestamps
    end
  end
end
