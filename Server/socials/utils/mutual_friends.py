from accounts.models import PetSphereUser


def get_mutual_friends(user1, user2):
    mutual_friends = PetSphereUser.objects.filter(
        following_relations__follower=user1,
        follower_relations__following=user2
    )
    return mutual_friends


def get_mutual_friends_count(user1, user2):
    mutual_friends = PetSphereUser.objects.filter(
        following_relations__follower=user1,
        follower_relations__following=user2
    )
    return mutual_friends.count()
