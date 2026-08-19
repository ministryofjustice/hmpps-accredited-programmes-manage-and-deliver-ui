.PHONY: local-up local-api down clean logs ps seed teardown reseed restart-wiremock

# Number of referrals to seed.
SEED_COUNT ?= 50
# Number of groups to seed (referrals are allocated onto these).
GROUP_COUNT ?= 5

API_REPO_DIR ?= ../hmpps-accredited-programmes-manage-and-deliver-api
SEED_SCRIPT := $(API_REPO_DIR)/scripts/seed-data.sh

# Starts every dependency the UI needs (API, auth, postgres, wiremock, localstack) - the UI itself
# should be started separately with 'npm run start:dev'.
local-up:
	docker compose up -d --wait --wait-timeout 300
	@echo ""
	@echo "Local dependency stack ready:"
	@echo "  API         http://localhost:8080"
	@echo "  AUTH        http://localhost:8090/auth"
	@echo "  POSTGRES    localhost:5432"
	@echo "  WIREMOCK    http://localhost:9095"
	@echo "  LOCALSTACK  http://localhost:4566"
	@echo ""
	@echo "Next: 'npm run start:dev' to start the UI,"
	@echo "then 'make seed' to generate referrals + groups."

# Starts every dependency except the API - use this when running the API yourself from IntelliJ
# (run configuration profiles: dev,local,seeding). Requires API_SEEDED_WIREMOCKS_PATH to be set
# (see .env) so wiremock can see the stubs the locally-running API writes to disk.
local-api:
	docker compose -f docker-compose-local.yml up -d --wait --wait-timeout 300
	@echo ""
	@echo "Local dependency stack ready (API excluded):"
	@echo "  AUTH        http://localhost:8090/auth"
	@echo "  POSTGRES    localhost:5432"
	@echo "  WIREMOCK    http://localhost:9095"
	@echo "  LOCALSTACK  http://localhost:4566"
	@echo ""
	@echo "Next: start the API from IntelliJ (profiles: dev,local,seeding),"
	@echo "then 'npm run start:dev' to start the UI,"
	@echo "then 'make seed' to generate referrals + groups."

down:
	docker compose down

clean:
	docker compose down -v

logs:
	docker compose logs -f

ps:
	docker compose ps

seed: check-seed-script
	$(SEED_SCRIPT) seed $(SEED_COUNT) $(GROUP_COUNT)
	$(MAKE) restart-wiremock

# Remove all seeded data (groups then referrals).
teardown: check-seed-script
	$(SEED_SCRIPT) teardown

check-seed-script:
	@test -x "$(SEED_SCRIPT)" || { \
		echo "Can't find $(SEED_SCRIPT)"; \
		echo "Expected the API repo checked out at $(API_REPO_DIR) (override with API_REPO_DIR=<path>)."; \
		exit 1; \
	}

# Clean slate: remove previous data, then seed a fresh set of referrals and groups.
reseed: teardown seed

restart-wiremock:
	docker compose restart wiremock
