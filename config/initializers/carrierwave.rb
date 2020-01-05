require 'carrierwave/storage/abstract'
require 'carrierwave/storage/file'
require 'carrierwave/storage/fog'

CarrierWave.configure do |config|
  config.storage = :fog
  config.fog_provider = 'fog/google'
  config.fog_credentials = {
    # provider: 'AWS',
    # aws_access_key_id: Rails.application.credentials.aws[:aws_access_key_id],
    # aws_secret_access_key: Rails.application.credentials.aws[:secret_access_key],
    # region: 'ap-northeast-1'
    provider: 'Google',
    google_storage_access_key_id:     Rails.application.credentials.gcs[:access_key],
    google_storage_secret_access_key: Rails.application.credentials.gcs[:secret_key]
  }

  # config.fog_directory  = 'freemarket-uno'
  # config.asset_host = 'https://s3-ap-northeast-1.amazonaws.com/freemarket-uno'
  config.fog_directory = 'ufms-storage'
end
